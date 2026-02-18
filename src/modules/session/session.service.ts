import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import * as argon2 from 'argon2'
import type { Request } from 'express'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { IPinfoWrapper } from 'node-ipinfo'

import { CreateSessionType } from './interface/session'
import * as crypto from 'crypto';

import uap = require('ua-parser-js')
import ms from 'ms'
import { AppConfigService } from 'src/config/config.service'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class SessionService {
	private ipinfoWrapper: IPinfoWrapper
	constructor(
		private prisma: PrismaService,
		private configService: AppConfigService,
		private i18n: I18nService,
	) {
		this.ipinfoWrapper = new IPinfoWrapper('ed8ceef222d443')
	}

	private hashRefreshToken(token: string): string {
		return crypto
			.createHash('sha256')
			.update(token + this.configService.jwt.refreshTokenPepper) // добавляем "перец" для усиления
			.digest('hex');
	}



	async create({ req, refreshToken, userId }: CreateSessionType): Promise<boolean> {
		const userAgent = req.headers['user-agent'] ?? 'unknown'
		const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown'
		const geo = await this.ipinfoWrapper.lookupIp(ip)
		const deviceInfo = uap.UAParser(userAgent)

		const hashedRefreshToken = this.hashRefreshToken(refreshToken)

		try {
			await this.prisma.session.create({
				data: {
					refreshToken: hashedRefreshToken,
					ip,
					userAgent,
					deviceInfo: {
						os: deviceInfo.os.name,
						browser: deviceInfo.browser.name,
						type: deviceInfo.device.type
					},
					location: {
						city: geo.city,
						region: geo.region,
						country: geo.country
					},
					userId
				}
			})
			return true
		} catch (error) {
			throw new InternalServerErrorException(
				this.i18n.translate('session.error', {
					lang: I18nContext.current()?.lang
				})
			)
		}

	}
}