import { db } from '$lib/firebase/client/firebase'
import { editionId } from '$lib/types/domain/edition'
import type { Song, SongSuggestion, SuggestedSong } from '$lib/types/domain/song'
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	updateDoc
} from 'firebase/firestore'

/**
 * Get the song data for the given ids
 * @param ids The ids of the songs to get
 * @returns The song data for the given ids
 */
export async function getSongs(ids: string[]) {
	// Get the song objects from the rehearsal songs
	const songDocs = await Promise.all(ids.map((id) => getDoc(doc(db, 'songs/' + id))))
	return songDocs.map((doc) => ({ id: doc.id, ...doc.data() } as Song))
}

/**
 * Get the (suggested) song data for the given ids
 * @param ids Optional: the ids of the songs to get
 * @returns The song data for the given ids, or all suggestions if no ids are given
 */
export async function getSuggestedSongs(ids?: string[]) {
	// Get all the suggestions
	const suggestionsQuery = query(collection(db, 'songs'), orderBy('suggestionDate'))
	const suggestions = (await getDocs(suggestionsQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as SuggestedSong)
	)

	// If no ids are given, return all suggestions
	if (!ids) return suggestions

	// Otherwise, filter the suggestions
	return suggestions.filter((suggestion) => ids.includes(suggestion.id))
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
export async function createSongFromSuggestion(song: SongSuggestion) {
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
