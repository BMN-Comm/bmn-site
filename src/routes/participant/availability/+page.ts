import type { PageLoad } from './$types'
import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { query, collection, getDocs, orderBy } from 'firebase/firestore'
import type { rehearsal } from '$lib/types/domain/rehearsal'
import type { availability } from '$lib/types/domain/availability'

export const ssr = false

export const load: PageLoad = async ({ parent }) => {
	await verifyUserLoggedIn()

	// Maybe filter editions?
	const rehearsalsQuery = query(collection(db, 'rehearsals'), orderBy('startTime')) //, where('startTime', '>=', Timestamp.now()))
	const rehearsals = (await getDocs(rehearsalsQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as rehearsal)
	)

	const availabilityQuery = query(
		collection(db, 'users/' + (await parent()).user.databaseId + '/availability'),
		orderBy('startTime')
	)
	const availability = (await getDocs(availabilityQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as availability)
	)

	return { rehearsals, availability }
}
