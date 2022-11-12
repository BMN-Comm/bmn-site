import type { PageLoad } from './$types'
import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	const announcementsQuery = query(collection(db, 'announcements'), orderBy('publishDate', 'desc'))
	const announcements = await getDocs(announcementsQuery)
	return {
		announcements: announcements.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data()
			}
		})
	}
}
