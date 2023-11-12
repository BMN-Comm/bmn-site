import type { PageLoad } from './$types'
import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { query, collection, getDocs, orderBy, where, Timestamp } from 'firebase/firestore'
import type { Rehearsal } from '$lib/types/domain/rehearsal'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	// Maybe filter editions?
	const rehearsalsQuery = query(
		collection(db, 'rehearsals'),
		orderBy('endTime', 'asc'),
		where('endTime', '>=', Timestamp.now())
	)
	const rehearsals = (await getDocs(rehearsalsQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as Rehearsal)
	)

	return { rehearsals }
}
