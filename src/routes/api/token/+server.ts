import { decodeToken } from '$lib/firebase/server/firebase'
import type { RequestHandler } from '@sveltejs/kit'
import cookie from 'cookie'
import type { User } from 'firebase/auth'

/** Set the given authentication in the cookies */
export const POST: RequestHandler = async (event) => {
	const payload = await event.request.json()
	const token: string = payload.token || ''
	const decodedToken = await decodeToken(token)
	const user: User | null = payload.user

	const response = new Response('', {
		headers: {
			'set-cookie': cookie.serialize(
				'__session',
				JSON.stringify(
					decodedToken && user
						? {
								name: user.displayName,
								email: user.email,
								uid: user.uid,
								admin: decodedToken.admin ?? false,
								commissie: decodedToken.commissie ?? false,
								token: token
						  }
						: {}
				),
				{
					path: '/',
					httpOnly: true
				}
			)
		}
	})

	return response
}
