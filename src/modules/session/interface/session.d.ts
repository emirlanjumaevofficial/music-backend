import { Request } from 'express'

export interface CreateSessionType {
	refreshToken: string
	req: Request
	userId: string
}
