import type { Handle } from '@sveltejs/kit'
import cookie from 'cookie'
import { prerendering } from '$app/environment'

// Hooks file used for server side functions, see https://kit.svelte.dev/docs/hooks

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname?.toLowerCase() == '/auditions')
		return new Response('redirecting...', {
			status: 302,
			headers: new Headers({
				status: '302',
				Location: `https://forms.gle/wHRwks5aiH9rLjxZ7`
			})
		})

	// When asking for a refresh token or api token, resolve before the token can fail
	if (
		event.url.pathname?.startsWith('/refresh-token') ||
		event.url.pathname?.startsWith('/api/token')
	)
		return resolve(event)

	// If the app is prerendering during deploy, we don't want to run the rest of the code as it will cause env errors
	if (prerendering) return await resolve(event)

	// Which unfortunately also means we need to import the ugly way :(
	const decodeToken = (await import('$lib/firebase/server/firebase')).decodeToken

	// See if an authentication cookie is set, then try to decode it.
	const cookies = cookie.parse(event.request.headers.get('cookie') || '')

	const decodedToken =
		(cookies.__session && (await decodeToken(JSON.parse(cookies.__session).token))) || null

	// If we find out the token has expired, redirect to it can be refreshed.
	if (decodedToken === 'token-expired')
		return new Response('Trying auth refresh...', {
			status: 302,
			headers: new Headers({
				status: '302',
				Location: `/refresh-token?redirect=${event.request.url}`
			})
		})

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

	// We store the decoded cookie in the event locals, so it can be passed to the session
	if (decodedToken) {
		const { uid, name, email, admin, commissie } = decodedToken
		event.locals.session = {
			user: {
				name: name || null,
				email: email || null,
				uid,
				admin: admin ?? false,
				commissie: commissie ?? false
			}
		}
	} else {
		event.locals.session = { user: undefined }
	}

	// Then resolve as normal
	return await resolve(event)
}
