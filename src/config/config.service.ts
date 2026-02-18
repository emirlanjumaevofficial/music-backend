import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AppConfigType } from './configuration'

@Injectable()
export class AppConfigService {
	constructor(private config: ConfigService) {}
	get port(): AppConfigType['port'] {
		return this.config.getOrThrow('port')
	}

	get database(): AppConfigType['database'] {
		return this.config.getOrThrow('database')
	}

	get jwt(): AppConfigType['jwt'] {
		return this.config.getOrThrow('jwt')
	}
}
