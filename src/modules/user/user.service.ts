import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import * as argon2 from 'argon2'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { User } from 'prisma/generated/client'
import { PrismaService } from 'src/core/prisma/prisma.service'

import { RegisterDto } from '../auth/dto/auth.dto'

import { UserType } from './interface/user'

@Injectable()
export class UserService {
	constructor(
		private prismaService: PrismaService,
		private i18n: I18nService,
	) { }

	async findByEmail(email: string): Promise<UserType | null> {
		const findUser = await this.prismaService.user.findUnique({
			where: { email }
		})
		if (!findUser) return null
		const { password, ...rest } = findUser
		return rest
	}

	async findById(id: string): Promise<UserType | null> {
		const findUser = await this.prismaService.user.findUnique({
			where: { id }
		})
		if (!findUser) return null
		const { password, ...rest } = findUser
		return rest
	}

	async create(body: RegisterDto) {
		try {
			const hashedPassword = await argon2.hash(body.password)
			return await this.prismaService.user.create({
				data: { ...body, password: hashedPassword }
			})
		} catch (error) {
			console.log(error)

			throw new InternalServerErrorException(error)
		}
	}

	async validateUser(email: string, password: string): Promise<UserType> {
		const findUser = await this.prismaService.user.findUnique({
			where: { email }
		})
		if (!findUser)
			throw new NotFoundException(
				this.i18n.translate('user.emailNotFound', {
					lang: I18nContext.current()?.lang
				})
			)
		const checkPassword = await argon2.verify(findUser.password, password)
		if (!checkPassword)
			throw new BadRequestException(
				this.i18n.translate('user.invalidPassword', {
					lang: I18nContext.current()?.lang
				})
			)
		const { password: pw, ...rest } = findUser
		return rest
	}
}
