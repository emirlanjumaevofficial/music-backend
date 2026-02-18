import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AppConfigService } from './config.service'
import configuration from './configuration'
import { validationSchema } from './validation-schema'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env'],
			load: [configuration],
			validationSchema,
			validationOptions: {
				allowUnknown: true, // разрешить сторонние переменные в процессе
				abortEarly: true // упасть сразу при первой ошибке
			}
		})
	],
	providers: [ConfigService, AppConfigService],
	exports: [AppConfigService]
})
export class AppConfigModule {}
