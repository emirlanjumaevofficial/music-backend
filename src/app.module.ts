import { Module } from '@nestjs/common'
import {
	AcceptLanguageResolver,
	I18nJsonLoader,
	I18nModule,
	QueryResolver
} from 'nestjs-i18n'
import { join } from 'path'

import { AppConfigModule } from './config/config.module'
import { PrismaModule } from './core/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { SessionModule } from './modules/session/session.module'
import { UserModule } from './modules/user/user.module'

@Module({
	imports: [
		I18nModule.forRoot({
			fallbackLanguage: 'en',
			loader: I18nJsonLoader,
			loaderOptions: {
				path: join(__dirname, '../apps/api/i18n/'),
				watch: true // TODO: remove this in production
			},
			resolvers: [AcceptLanguageResolver]
		}),
		AppConfigModule,
		AuthModule,
		PrismaModule,
		UserModule,
		SessionModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
