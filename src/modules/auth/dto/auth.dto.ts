import { PickType } from '@nestjs/mapped-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'
import type { Role, User } from 'prisma/generated/client'

export class RegisterDto implements Pick<
	User,
	'email' | 'password' | 'firstName' | 'lastName'
> {
	@ApiProperty({
		example: 'user@example.com',
		description: 'User email address'
	})
	@IsNotEmpty({
		message: i18nValidationMessage('common.validation.required')
	})
	@IsEmail({}, { message: i18nValidationMessage('common.validation.email') })
	email: string

	@ApiProperty({
		example: 'Password123!',
		description:
			'Password (min 8 chars, uppercase, lowercase, number, special char)'
	})
	@IsString()
	@MinLength(8, {
		message: i18nValidationMessage('common.validation.minLength', {
			min: 8
		})
	})
	@MaxLength(32, {
		message: i18nValidationMessage('common.validation.maxLength', {
			max: 32
		})
	})
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		{
			message: i18nValidationMessage('common.validation.password')
		}
	)
	password: string

	@ApiPropertyOptional({ example: 'John', description: 'First name' })
	@IsOptional()
	@IsString()
	firstName: string

	@ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
	@IsOptional()
	@IsString()
	lastName: string
}

export class LoginDto extends PickType(RegisterDto, [
	'email',
	'password'
] as const) {}

export class RefreshDto {
	@ApiProperty({
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		description: 'Refresh token for obtaining new access and refresh tokens'
	})
	@IsNotEmpty({
		message: 'Refresh token must not be empty'
	})
	@IsString({
		message: 'Refresh token must be a string'
	})
	refreshToken: string
}
