import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AppConfigService } from 'src/config/config.service'

import { SessionModule } from '../session/session.module'
import { SessionService } from '../session/session.service'
import { UserModule } from '../user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [
		UserModule,
		JwtModule.registerAsync({
			inject: [AppConfigService],
			useFactory: (config: AppConfigService) => {
				return {
					global: true,
					secret: config.jwt.access.secret,
					signOptions: {
						expiresIn: config.jwt.access.expires as any
					}
				}
			}
		}),
		SessionModule
	],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
