import { db } from '$lib/firebase/server/firebase'
import type { LayoutServerLoad } from './$types'

export const prerender = false

export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.session.user) {
		const userDocs = await db
			.collection('users')
			.where('email', '==', locals.session.user.email)
			.get()

		const dbUser = userDocs.docs[0]

		return {
			user: {
				...locals.session.user,
				databaseId: dbUser.id,
				name: dbUser.data().name,
				// I don't really understand why it couldn't figure this out on its own
				toJSON: locals.session.user.toJSON
			}
		}
	}
	return { user: undefined }
}
