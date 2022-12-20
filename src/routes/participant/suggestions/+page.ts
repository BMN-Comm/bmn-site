import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import type { song } from '$lib/types/domain/song'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent }) => {
	await verifyUserLoggedIn()

	var userRef = doc(db, 'users', (await parent()).user!.databaseId)

	var songQuery = query(collection(db, 'songs'), where('user', '==', userRef))
	var songDocs = (await getDocs(songQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as song)
	)

    return { songDocs }
}
