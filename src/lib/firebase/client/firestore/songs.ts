import { db } from '$lib/firebase/client/firebase'
import type { Song, SuggestedSong } from '$lib/types/domain/song'
import { QueryWhereInBatched } from '$lib/util/queryWhereIn'
import { collection, getDocs, query } from 'firebase/firestore'

/** Get the song data for the given ids */
export async function getSongs(ids: string[]) {
	// Get the song objects from the rehearsal songs
	const songDocs = await QueryWhereInBatched(collection(db, 'songs'), '__name__', ids)
	return songDocs.map((doc) => ({ id: doc.id, ...doc.data() } as Song))
}

/**
 * Get the (suggested) song data for the given ids
 * @param ids Optional: the ids of the songs to get
 * @returns The song data for the given ids, or all suggestions if no ids are given
 */
export async function getSuggestedSongs(ids?: string[]) {
	const songDocs = ids
		? await QueryWhereInBatched(collection(db, 'songs'), '__name__', ids)
		: (await getDocs(query(collection(db, 'songs')))).docs

	return songDocs
		.map((doc) => ({ id: doc.id, ...doc.data() } as SuggestedSong))
		.sort((a, b) => a.suggestionDate.seconds - b.suggestionDate.seconds)
}
