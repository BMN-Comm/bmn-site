import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import type { PageLoad } from './$types'
import type { rehearsal } from '$lib/types/domain/rehearsal'
import type { availability } from '$lib/types/domain/availability'

export const ssr = false

export const load: PageLoad = async ({ params, parent }) => {
	await verifyUserLoggedIn()

	const rehearsalRef = doc(db, 'rehearsals/', params.rehearsalId)
	const rehearsalDoc = await getDoc(rehearsalRef)
	const rehearsal = { id: rehearsalDoc.id, ...rehearsalDoc.data() } as unknown as rehearsal

	const availabilityQuery = query(
		collection(db, 'users/' + (await parent()).user!.databaseId + '/availability'),
		where('rehearsal', '==', rehearsalRef)
	)

	const availabilityDocs = (await getDocs(availabilityQuery)).docs
	const availibilityMaybe = availabilityDocs[0]

	const availability = (
		availibilityMaybe ? { id: availibilityMaybe.id, ...availibilityMaybe.data() } : undefined
	) as availability | undefined

	return {
		rehearsal,
		availability
	}
}
