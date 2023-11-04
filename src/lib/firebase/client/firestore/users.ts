import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { bmnAdminUserId, type user } from '$lib/types/domain/user'

/** Get data of all users (but the BMN admin) */
export async function GetAllUsers() {
	const usersQuery = query(collection(db, 'users'), where('__name__', '!=', bmnAdminUserId))
	return (await getDocs(usersQuery)).docs.map((user) => ({ id: user.id, ...user.data() } as user))
}
