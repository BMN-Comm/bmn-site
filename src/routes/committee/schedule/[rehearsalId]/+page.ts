import type { PageLoad } from './$types'
import { db } from '$lib/firebase/client/firebase'
import { query, collection, getDocs, orderBy } from 'firebase/firestore'
import type { rehearsal } from '$lib/types/domain/rehearsal'

export const load: PageLoad = async () => {
	
}