import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, query } from 'firebase/firestore'
import type { user } from '$lib/types/domain/user'

/** Get data of the given user ids */
export async function GetAllUsers() {
	const usersQuery = query(collection(db, 'users'))
	return (await getDocs(usersQuery)).docs.map((user) => ({ id: user.id, ...user.data() } as user))
}
