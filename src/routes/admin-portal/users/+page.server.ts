import { getAuthUsers } from '$lib/firebase/server/firebase'
import { db } from '$lib/firebase/server/firebase'
import type { AuthUser } from '$lib/types/auth/authUser'
import type { User } from '$lib/types/domain/user'

export const load = async function () {
	const authUsers = await getAuthUsers()

	const users = (await db.collection('users').get()).docs.map<User>((d) => {
		const data = d.data()
		return {
			id: d.id,
			email: data.email,
			name: data.name,
			playsInstruments: [],
			playsSongs: [],
			availability: []
		}
	})

	return {
		users: users?.map((user) => ({
			...user,
			authUser: authUsers?.users
				// Map to authUsers, since the object can't be serialized otherwise
				.map<AuthUser>((u) => ({
					uid: u.uid,
					email: u.email
				}))
				.find((u) => u.email === user.email)
		}))
	}
}
