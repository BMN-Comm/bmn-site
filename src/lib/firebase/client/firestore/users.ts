import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { bmnAdminUserId, type User } from '$lib/types/domain/user'
import { QueryWhereInBatched } from '$lib/util/queryWhereIn'

/** Get data of the given user ids */
export async function getUsers(ids?: string[]) {
	const userDocs = ids
		? await QueryWhereInBatched(collection(db, 'users'), '__name__', ids)
		: (await getDocs(query(collection(db, 'users'), where('__name__', '!=', bmnAdminUserId)))).docs

	return userDocs.map((user) => ({ id: user.id, ...user.data() } as User))
}
