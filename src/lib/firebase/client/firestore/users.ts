import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, query } from 'firebase/firestore'
import type { user } from '$lib/types/domain/user'

/** Get data of the given user ids */
export async function getUsers(ids?: string[]) {
	const usersQuery = query(collection(db, 'users'))
	const users = (await getDocs(usersQuery)).docs.map(
		(user) => ({ id: user.id, ...user.data() } as user)
	)

	// If no ids are given, return all users
	if (!ids) return users

	// Otherwise, filter the users
	return users.filter((user) => ids.includes(user.id))
}
