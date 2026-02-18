import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n'


import { AppModule } from './app.module'
import { AppConfigService } from './config/config.service'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(AppConfigService)

	app.setGlobalPrefix('api')

	// i18n validation pipe
	app.useGlobalPipes(
		new I18nValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	)

	// i18n exception filter
	app.useGlobalFilters(new I18nValidationExceptionFilter())

	// Swagger configuration
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Music Backend API')
		.setDescription('API documentation for Music Backend')
		.setVersion('1.0')
		.addBearerAuth()
		.build()

	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('docs', app, document)



	await app.listen(config.port, () => {
		console.log('The server started: http://localhost:' + config.port)
		console.log('Swagger UI: http://localhost:' + config.port + '/api/docs')
	})
}
bootstrap()
