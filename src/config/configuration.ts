export interface AppConfigType {
	nodeEnv: string
	port: number
	database: {
		url: string
		user: string
		password: string
		host: string
		port: number
		db_name: string
	}
	jwt: {
		access: {
			secret: string
			expires: string
		}
		refresh: {
			secret: string
			expires: string
		},
		refreshTokenPepper: string
	}
}

export default (): AppConfigType => ({
	nodeEnv: process.env.NODE_ENV!,
	port: parseInt(process.env.PORT || '', 10) || 3000,
	database: {
		url: process.env.PG_URI!,
		user: process.env.PG_USER!,
		password: process.env.PG_PASSWORD!,
		host: process.env.PG_HOST!,
		port: parseInt(process.env.PG_PORT || '', 10) || 5432,
		db_name: process.env.PG_DB!
	},
	jwt: {
		access: {
			secret: process.env.JWT_ACCESS_SECRET!,
			expires: process.env.JWT_ACCESS_EXPIRES!
		},
		refresh: {
			secret: process.env.JWT_REFRESH_SECRET!,
			expires: process.env.JWT_REFRESH_EXPIRES!
		},
		refreshTokenPepper: process.env.REFRESH_TOKEN_PEPPER!
	}
})
