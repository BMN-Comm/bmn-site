import { db } from '$lib/firebase/client/firebase'
import type { song } from '$lib/types/domain/song'
import { doc, getDoc } from 'firebase/firestore'

/** Get the song data for the given ids */
export async function getSongs(ids: string[]) {
	// Get the song objects from the rehearsal songs
	const songDocs = await Promise.all(ids.map((id) => getDoc(doc(db, 'songs/' + id))))
	return songDocs.map((doc) => ({ id: doc.id, ...doc.data() } as song))
}
