import type { PageLoad } from './$types'
import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

export const load: PageLoad = async () => {
	const announcementsQuery = query(collection(db, 'announcements'), orderBy('publishDate'))
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
