import type { GetSession, Handle } from '@sveltejs/kit'
import cookie from 'cookie'
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { decodeToken } from './lib/firebase/server/firebase'

// Hooks file used for server side functions, see https://kit.svelte.dev/docs/hooks

export const handle: Handle = async ({ event, resolve }) => {
	// See if an authentication cookie is set, then try to decode it.
	const cookies = cookie.parse(event.request.headers.get('cookie') || '')
	const decodedToken = await decodeToken(cookies.token)
	event.locals.decodedToken = decodedToken

	// Make sure that only users logged in with bmn@a-eskwadraat.nl are allowed to access the admin portal
	if (
		event.request.url.match('.*/admin-portal.*')?.length &&
		(!decodedToken || decodedToken.email !== 'bmn@a-eskwadraat.nl')
	) {
		return new Response('Hey! Daar mag jij helemaal niet komen! 😡', {
			headers: new Headers({
				status: '403'
			})
		})
	}

	// Then resolve as normal
	return await resolve(event)
}

export const getSession: GetSession = async (event) => {
	// We store the decoded cookie in the event locals, so it can be passed to the session
	const decodedToken: DecodedIdToken | null = event.locals.decodedToken
	if (decodedToken) {
		const { uid, name, email } = decodedToken
		return {
			user: { name: name || null, email: email || null, uid }
		}
	} else {
		return { user: undefined }
	}
}
