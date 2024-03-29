import { getAuthUsers } from '$lib/firebase/server/firebase'
// import type { Load } from '@sveltejs/kit'

export const load = async function () {
	const users = await getAuthUsers()
	return {
		users: users?.users.map((user) => ({
			id: user.uid,
			email: user.email,
			customClaims: user.customClaims
		}))
	}
}
