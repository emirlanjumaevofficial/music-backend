import { Controller, Get, Param } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'

import { UserService } from './user.service'

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by ID' })
	@ApiResponse({ status: 200, description: 'User found' })
	@ApiResponse({ status: 404, description: 'User not found' })
	getById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@Get('me')
	@ApiOperation({ summary: 'Get User Profile' })
	@ApiResponse({ status: 200, description: 'Get Profile' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'User not found' })
	getProfile() {}
}
