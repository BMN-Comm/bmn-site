import { db } from '$lib/firebase/client/firebase'
import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import type { PageLoad } from './$types'
import type { rehearsal } from '$lib/types/domain/rehearsal'
import type { availability } from '$lib/types/domain/availability'
import type { user } from '$lib/types/domain/user'
import { toDict } from '$lib/util/dict'

export const load: PageLoad = async ({ params }) => {
	const rehearsalRef = doc(db, 'rehearsals/', params.rehearsalId)
	const rehearsal = (await getDoc(rehearsalRef)).data() as rehearsal

	const usersQuery = collection(db, 'users')
	const users = (await getDocs(usersQuery)).docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	})) as user[]

	const availabilityQuery = query(
		collectionGroup(db, 'availability'),
		where('rehearsal', '==', rehearsalRef)
	)

	const availabilitiesDict = toDict(
		(await getDocs(availabilityQuery)).docs.map((document) => {
			if (document.ref.parent.parent != null) {
				return {
					[document.ref.parent.parent.id]: { id: document.id, ...document.data() } as availability
				}
			}
		})
	)
	return { users, availabilities: availabilitiesDict, rehearsal }
}
