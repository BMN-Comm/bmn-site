import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.session.user) {
		const usersQuery = query(
			collection(db, 'users'),
			where('email', '==', locals.session.user.email)
		)
		const dbUser = (await getDocs(usersQuery)).docs[0]

		return {
			user: { ...locals.session.user, databaseId: dbUser.id, name: dbUser.data().name }
		}
	}
	return {}
}
