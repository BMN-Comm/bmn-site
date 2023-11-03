import type { PageLoad } from './$types'
import { verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { getSuggestedSongs } from '$lib/firebase/client/firestore/songs'
import { getUsers } from '$lib/firebase/client/firestore/users'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	// Get all the suggestions
	const suggestions = await getSuggestedSongs()

	// Get all the users
	const users = await getUsers()

	// Bundle and return all data
	return { suggestions, users }
}
