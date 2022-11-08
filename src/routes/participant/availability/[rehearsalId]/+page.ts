import { db } from '$lib/firebase/client/firebase'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import type { PageLoad } from './$types'
import type { rehearsal } from '$lib/types/domain/rehearsal'
import type { availability } from '$lib/types/domain/availability'

export const load: PageLoad = async ({ params, parent }) => {
	const rehearsalRef = doc(db, 'rehearsals/', params.rehearsalId)
	const rehearsal = (await getDoc(rehearsalRef)).data() as rehearsal

	const availabilityQuery = query(
		collection(db, 'users/' + (await parent()).user.databaseId + '/availability'),
		where('rehearsal', '==', rehearsalRef)
	)

	const availabilityDocs = (await getDocs(availabilityQuery)).docs
	let availability: availability

	if (availabilityDocs.length > 0) {
		availability = availabilityDocs[0].data() as availability
		availability.id = availabilityDocs[0].id
	} else {
		availability = {
			id: '',
			available: true,
			startTime: rehearsal.startTime,
			endTime: rehearsal.endTime,
			rehearsal: rehearsalRef,
			reason: ''
		}
	}

	return {
		rehearsal: rehearsal,
		availability: availability
	}
}
