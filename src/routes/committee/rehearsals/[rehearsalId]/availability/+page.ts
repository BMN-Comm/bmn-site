import type { PageLoad } from './$types'
import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { query, getDocs, where, doc, collectionGroup } from 'firebase/firestore'
import { getUsers } from '$lib/firebase/client/firestore/users'
import type { availability } from '$lib/types/domain/availability'

export const ssr = false

export const load: PageLoad = async ({ params }) => {
	await verifyUserLoggedIn()

	const users = await getUsers()

	const availabilityQuery = query(
		collectionGroup(db, 'availability'),
		where('rehearsal', '==', doc(db, 'rehearsals/', params.rehearsalId))
	)
	const allAvailability = (await getDocs(availabilityQuery)).docs

	const userAvailabilities: { name: string; availability: availability | undefined }[] = users.map(
		(user) => {
			return {
				name: user.name,
				availability: allAvailability.find((x) => x.ref.parent.parent!.id === user.id)?.data() as
					| availability
					| undefined
			}
		}
	)

	return { userAvailabilities }
}
