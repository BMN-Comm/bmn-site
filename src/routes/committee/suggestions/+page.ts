import type { PageLoad } from './$types'
import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { query, collection, getDocs, orderBy } from 'firebase/firestore'
import { toDict } from '$lib/util/dict'
import type { song } from '$lib/types/domain/song'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	// Get all the suggestions
	const suggestionsQuery = query(collection(db, 'songs'), orderBy('suggestionDate'))
	const suggestions = (await getDocs(suggestionsQuery)).docs

	// Get all users
	const usersQuery = query(collection(db, 'users'))
	const usersDict = toDict(
		(await getDocs(usersQuery)).docs.map((document) => ({
			[document.id]: document.data().name
		}))
	)

	// Bundle and return all data
	return {
		suggestions: suggestions.map((doc) => {
			const data = doc.data()
			return {
				song: { id: doc.id, ...data } as song,
				user: usersDict[data.user.id]
			}
		})
	}
}
