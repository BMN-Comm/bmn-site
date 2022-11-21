import { db } from '$lib/firebase/client/firebase'
import type { song } from '$lib/types/domain/song'
import { collection, getDocs, query, where } from 'firebase/firestore'

/** Get the song data for the given ids */
export async function getSongs(ids: string[]) {
	// Get the song objects from the rehearsal songs
	const songsQuery = query(collection(db, 'songs'), where('__name__', 'in', ids))
	const songDocs = (await getDocs(songsQuery)).docs
	return songDocs.map((doc) => ({ id: doc.id, ...doc.data() } as song))
}
