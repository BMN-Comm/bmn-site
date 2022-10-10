import { getAuthUsers } from '$lib/firebase/server/firebase'
import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, query } from 'firebase/firestore'
import type { authUser } from '$lib/types/auth/authUser'
import type { user } from '$lib/types/domain/user'

export const load = async function () {
	const authUsers = await getAuthUsers()

	const users = (await getDocs(query(collection(db, 'users')))).docs.map<user>((d) => {
		const data = d.data()
		return {
			id: d.id,
			email: data.email,
			name: data.name,
			playsInstruments: [],
			playsSongInEdition: [],
			availibility: []
		}
	})

	return {
		users: users?.map((user) => ({
			...user,
			authUser: authUsers?.users
				// Map to authUsers, since the object can't be serialized otherwise
				.map<authUser>((u) => ({
					uid: u.uid,
					email: u.email
				}))
				.find((u) => u.email === user.email)
		}))
	}
}
