import * as Joi from 'joi'

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.default('development'),
	PORT: Joi.number().default(8000),

	// Database
	PG_URI: Joi.string().required(),
	PG_USER: Joi.string().required(),
	PG_PASSWORD: Joi.string().required(),
	PG_HOST: Joi.string().required(),
	PG_PORT: Joi.number().default(5432),
	PG_DB: Joi.string().required(),

	// JWT
	JWT_ACCESS_SECRET: Joi.string().required(),
	JWT_REFRESH_SECRET: Joi.string().required(),
	JWT_ACCESS_EXPIRES: Joi.string().required(),
	JWT_REFRESH_EXPIRES: Joi.string().required(),

	REFRESH_TOKEN_PEPPER: Joi.string().required()
})
