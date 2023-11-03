import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, query } from 'firebase/firestore'
import type { user } from '$lib/types/domain/user'
import { QueryWhereInBatched } from '$lib/util/queryWhereIn'

/** Get data of the given user ids */
export async function getUsers(ids?: string[]) {
	const userDocs = ids
		? await QueryWhereInBatched(collection(db, 'users'), 'id', ids)
		: (await getDocs(query(collection(db, 'users')))).docs

	return userDocs.map((user) => ({ id: user.id, ...user.data() } as user))
}
