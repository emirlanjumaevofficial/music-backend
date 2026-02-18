import { Body, Controller, Post, Req } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import type { Request } from 'express'

import { AuthService } from './auth.service'
import { LoginDto, RefreshDto, RegisterDto } from './dto/auth.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({ status: 201, description: 'User registered successfully' })
	@ApiResponse({
		status: 409,
		description: 'User with this email already exists'
	})
	register(@Body() registerDto: RegisterDto, @Req() req: Request) {
		return this.authService.register(registerDto, req)
	}

	@Post('login')
	@ApiOperation({ summary: 'Login user' })
	@ApiResponse({ status: 200, description: 'Login successful' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	login(@Body() loginDto: LoginDto, @Req() req: Request) {
		return this.authService.login(loginDto, req)
	}

	// @Post('refresh')
	// @ApiOperation({ summary: 'Refresh access and refresh tokens' })
	// @ApiResponse({
	// 	status: 200,
	// 	description: 'Tokens refreshed successfully'
	// })
	// @ApiResponse({
	// 	status: 401,
	// 	description: 'Invalid or expired refresh token'
	// })
	// refresh(@Body() refreshDto: RefreshDto, @Req() req: Request) {
	// 	return this.authService.refresh(refreshDto.refreshToken, req)
	// }
}
