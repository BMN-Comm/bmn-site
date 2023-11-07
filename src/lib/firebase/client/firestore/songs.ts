import { db } from '$lib/firebase/client/firebase'
import { editionId } from '$lib/types/domain/edition'
import type { Song, SuggestedSong } from '$lib/types/domain/song'
import { QueryWhereInBatched } from '$lib/util/queryWhereIn'
import { arrayUnion, collection, doc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore'

/**
 * Get the song data for the given ids
 * @param ids The ids of the songs to get
 * @returns The song data for the given ids
 */
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
		: (await getDocs(query(collection(db, 'users')))).docs

	return songDocs
		.map((doc) => ({ id: doc.id, ...doc.data() } as SuggestedSong))
		.sort((a, b) => a.suggestionDate.seconds - b.suggestionDate.seconds)
}

/**
 * Create a song in the database
 * @param song The song to add to the database
 * @returns The id of the created song
 */
export async function createSong(song: Omit<Song, 'id'>) {
	const newSong = doc(collection(db, 'songs'))
	await setDoc(newSong, song)
	return newSong.id
}

/**
 * Create a song in the database from a suggestion
 * @param song The song suggestion to create a song from
 * @returns The id of the created song
 */
export async function createSongFromSuggestion(song: Omit<SuggestedSong, 'id' | 'liked'>) {
	const suggestedSong = {
		...song,
		liked: false
	}
	const newSong = doc(collection(db, 'songs'))
	await setDoc(newSong, suggestedSong)
	return newSong.id
}

/**
 * Add a song to the setlist
 * @param id The id of the song to add to the setlist
 */
export async function addSongToSetlist(id: string) {
	const editionRef = doc(db, editionId)
	await updateDoc(editionRef, {
		songs: arrayUnion(doc(db, 'songs', id))
	})
}
