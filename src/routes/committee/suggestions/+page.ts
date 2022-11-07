import type { PageLoad } from './$types'
import { db } from '$lib/firebase/client/firebase'
import { query, collection, getDocs, orderBy, DocumentReference, where } from 'firebase/firestore'

export const load: PageLoad = async () => {
	// Get all the suggestions
	const suggestionsQuery = query(collection(db, 'songs'), orderBy('suggestionDate'))
	const suggestions = (await getDocs(suggestionsQuery)).docs

	// Get the users that made the suggestions
	const suggestionUserDocuments = suggestions.map(
		(suggestion) => (suggestion.get('user') as DocumentReference).id
	)
	const usersQuery = query(
		collection(db, 'users'),
		where('__name__', 'in', suggestionUserDocuments)
	)
	const usersDict = Object.assign(
		{},
		...(await getDocs(usersQuery)).docs.map((document) => ({
			[document.id]: document.data().name
		}))
	)

	// Bundle and return all data
	return {
		suggestions: suggestions.map((doc) => {
			const data = doc.data()
			return {
				song: { id: doc.id, ...data },
				user: usersDict[data.user.id]
			}
		})
	}
}
