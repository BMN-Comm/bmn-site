import type { PageLoad } from './$types'
import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { query, getDocs, where, doc, collectionGroup, getDoc } from 'firebase/firestore'
import { getUsers } from '$lib/firebase/client/firestore/users'
import type { Availability } from '$lib/types/domain/availability'
import type { Rehearsal } from '$lib/types/domain/rehearsal'

export const ssr = false

export const load: PageLoad = async ({ params }) => {
	await verifyUserLoggedIn()

	const rehearsalDoc = await getDoc(doc(db, 'rehearsals/', params.rehearsalId))
	const rehearsal = { id: rehearsalDoc.id, ...rehearsalDoc.data() } as Rehearsal

	const availabilityQuery = query(
		collectionGroup(db, 'availability'),
		where('rehearsal', '==', doc(db, 'rehearsals/', params.rehearsalId))
	)
	const allAvailability = (await getDocs(availabilityQuery)).docs.map((doc) => ({
		id: doc.id,
		userId: doc.ref.parent.parent!.id,
		...doc.data()
	}))

	const users = await getUsers()
	const userAvailabilities: {
		user: { id: string; name: string }
		availability: Availability | undefined
	}[] = users.map((user) => {
		const availability = allAvailability.find((x) => x.userId === user.id) as
			| Availability
			| undefined

		return {
			user: { id: user.id, name: user.name },
			availability
		}
	})

	return { userAvailabilities, rehearsal }
}
