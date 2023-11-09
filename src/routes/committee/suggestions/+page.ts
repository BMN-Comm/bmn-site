import type { PageLoad } from './$types'
import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { query, collection, getDocs, orderBy } from 'firebase/firestore'
import type { SuggestedSong } from '$lib/types/domain/song'
import { GetAllUsers } from '$lib/firebase/client/firestore/users'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	// Get all the suggestions
	const suggestionsQuery = query(collection(db, 'songs'), orderBy('suggestionDate'))
	const suggestions = (await getDocs(suggestionsQuery)).docs.map((doc) => {
		const data = doc.data()
		return { id: doc.id, ...data } as SuggestedSong
	})

	// Get all users
	const users = GetAllUsers()

	// Bundle and return all data
	return {
		suggestions,
		users
	}
}
