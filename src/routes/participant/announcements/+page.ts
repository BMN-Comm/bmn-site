import type { PageLoad } from './$types'
import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

export const load: PageLoad = async () => {
	const announcementsQuery = query(collection(db, 'announcements'), orderBy('publishDate'))
	const announcements = await getDocs(announcementsQuery)
	return {
		announcements: announcements.docs.map((doc) => {
			const docData = doc.data()
			return {
				id: doc.id,
				title: docData.title,
				content: docData.content,
				publishDate: docData.publishDate,
				edition: docData.edition,
				authorUser: docData.authorUser
			}
		})
	}
}
