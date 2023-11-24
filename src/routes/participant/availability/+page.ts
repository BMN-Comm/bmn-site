import type { PageLoad } from './$types'
import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { query, collection, getDocs, orderBy, where, Timestamp } from 'firebase/firestore'
import type { Rehearsal } from '$lib/types/domain/rehearsal'
import { toDict } from '$lib/util/dict'
import type { Availability } from '$lib/types/domain/availability'

export const ssr = false

export const load: PageLoad = async ({ parent }) => {
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

	const availabilityQuery = query(
		collection(db, 'users/' + (await parent()).user!.databaseId + '/availability'),
		orderBy('startTime')
	)
	const availability = toDict(
		(await getDocs(availabilityQuery)).docs.map((doc) => {
			const data = doc.data() as Availability
			return {
				[data.rehearsal.id]: data.available
			}
		})
	)

	return { rehearsals, availability }
}
