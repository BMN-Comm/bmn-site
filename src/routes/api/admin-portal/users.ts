import { getUsers } from '$lib/firebase/server/firebase'
import type { RequestHandler } from '@sveltejs/kit'

/** Get all the users in the app */
export const get: RequestHandler = async () => {
	const users = await getUsers()
	return { body: JSON.stringify(users?.users), status: 200 }
}
