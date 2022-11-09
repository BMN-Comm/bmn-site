import { db } from '$lib/firebase/client/firebase'
import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import type { PageLoad } from './$types'
import type { rehearsal } from '$lib/types/domain/rehearsal'
import type { newAvailability } from '$lib/types/domain/availability'
import type { user } from '$lib/types/domain/user'

export const load: PageLoad = async ({ params }) => {
	const rehearsalRef = doc(db, 'rehearsals/', params.rehearsalId)
	const rehearsal = (await getDoc(rehearsalRef)).data() as rehearsal

	const usersQuery = collection(db, 'users')

	// TODO: Create utility function for dictionary creation
	const users = Object.assign(
		{},
		...(await getDocs(usersQuery)).docs.map((doc) => ({
			[doc.id]: doc.data() as user
		}))
	)

	const availabilityQuery = query(
		collectionGroup(db, 'availability'),
		where('rehearsal', '==', rehearsalRef)
	)

	const availabilitiesDict = Object.assign(
		{},
		...(await getDocs(availabilityQuery)).docs.map((document) => {
			if (document.ref.parent.parent != null) {
				return {
					[document.ref.parent.parent.id]: document.data() as newAvailability
				}
			}
		})
	)
	return { users, availabilities: availabilitiesDict, rehearsal }
}
