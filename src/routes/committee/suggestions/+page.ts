import type { PageLoad } from './$types'
import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import {
	query,
	collection,
	getDocs,
	orderBy,
	DocumentReference,
	where,
	getDoc,
	doc
} from 'firebase/firestore'
import type { committee } from '$lib/types/domain/committee'
import { toDict } from '$lib/util/dict'
import type { song } from '$lib/types/domain/song'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

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
	const usersDict = toDict(
		(await getDocs(usersQuery)).docs.map((document) => ({
			[document.id]: document.data().name
		}))
	)

	const committee = // TODO: use current committee
		(await getDoc(doc(db, 'committees', 'yAUoMLjaAoC6L5O9F4gU'))).data() as committee
	const committeeFavouriteSongs = committee.likesSongs.map((s) => s.id)

	const favouriteSongs = Object.assign(
		{},
		...suggestions.map((suggestion) => ({
			[suggestion.id]: committeeFavouriteSongs.includes(suggestion.id) ? true : false
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
		}),
		favouriteSongs
	}
}
