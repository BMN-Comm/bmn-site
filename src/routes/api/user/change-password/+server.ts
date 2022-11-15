import { error, type RequestHandler } from '@sveltejs/kit'
import { updatePassword } from '$lib/firebase/server/firebase'

/** Change the password of a user */
export const POST: RequestHandler = async (event) => {
	const decodedToken = event.locals.decodedToken

	// If user is not logged in, return unauthorized
	if (decodedToken === null) throw error(401)

	const payload = await event.request.json()
	const uid: string = payload.uid || ''

	// If user is not logged in as given uid, return unauthorized
	if (uid !== decodedToken.uid) throw error(401)

	const newPassword: string | undefined = payload.newPassword

	// If no password is given, return bad request
	if (newPassword === undefined) throw error(400)

	await updatePassword(uid, newPassword)

	return new Response()
}
