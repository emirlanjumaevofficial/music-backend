import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { User } from 'prisma/generated/client'
import { AppConfigService } from 'src/config/config.service'
import { PrismaService } from 'src/core/prisma/prisma.service'

import { SessionService } from '../session/session.service'
import { UserService } from '../user/user.service'

import { LoginDto, RegisterDto } from './dto/auth.dto'
import { LoginResponse } from './interface/login-response'

@Injectable()
export class AuthService {
	constructor(
		// private readonly prisma: PrismaService,
		private userService: UserService,
		private jwtService: JwtService,
		private config: AppConfigService,
		private sessionService: SessionService,
		private i18n: I18nService,
	) { }

	async register(body: RegisterDto, req: Request) {
		const findUserByEmail = await this.userService.findByEmail(body.email)
		if (findUserByEmail)
			throw new ConflictException(
				this.i18n.translate('auth.emailAlreadyExists', {
					lang: I18nContext.current()?.lang
				})
			)
		await this.userService.create(body)
		return this.login({ email: body.email, password: body.password }, req)
	}

	async login(loginDto: LoginDto, req: Request): Promise<LoginResponse> {
		const isValidUser = await this.userService.validateUser(
			loginDto.email,
			loginDto.password
		)
		const tokens = await this.generateTokens(isValidUser)

		await this.sessionService.create({
			refreshToken: tokens.refreshToken,
			req,
			userId: isValidUser.id
		})

		return {
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken
		}
	}

	async generateTokens(
		body: Partial<User>
	): Promise<{ accessToken: string; refreshToken: string }> {
		const payload = { sub: body.id }
		const accessToken = await this.jwtService.signAsync(payload)
		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: this.config.jwt.refresh.secret,
			expiresIn: this.config.jwt.refresh.expires as any
		})
		return { accessToken, refreshToken }
	}
}
