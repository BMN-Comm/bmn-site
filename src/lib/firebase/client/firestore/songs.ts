import { db } from '$lib/firebase/client/firebase'
import type { Song, SongSuggestion, SuggestedSong } from '$lib/types/domain/song'
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore'

/** Get the song data for the given ids */
export async function getSongs(ids: string[]) {
	// Get the song objects from the rehearsal songs
	const songDocs = await Promise.all(ids.map((id) => getDoc(doc(db, 'songs/' + id))))
	return songDocs.map((doc) => ({ id: doc.id, ...doc.data() } as Song))
}

/** Get the (suggested) song data for the given ids */
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
 * Create a song in the database from a suggestion
 * @returns the id of the created song
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
