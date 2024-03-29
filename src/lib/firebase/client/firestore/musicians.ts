import { db } from '$lib/firebase/client/firebase'
import type { Musician } from '$lib/types/domain/musician'
import type { User } from '$lib/types/domain/user'
import { QueryWhereInBatched } from '$lib/util/queryWhereIn'
import { collection, collectionGroup, doc, getDoc } from 'firebase/firestore'

/** Get a dictionary of the musicians that play on the given songs */
export async function GetMusisciansThatPlaySongs(ids: string[]) {
	const musiciansForSongs: {
		[songId: string]: Musician[]
	} = {}

	// Get the song objects from the rehearsal songs
	const songDocs = await QueryWhereInBatched(collection(db, 'songs'), '__name__', ids)

	if (songDocs.length === 0) return musiciansForSongs

	// Init all songs so they don't dissappear
	for (const song of songDocs) {
		musiciansForSongs[song.id] = []
	}

	const playsInDocs = await QueryWhereInBatched(
		collectionGroup(db, 'playsSongs'),
		'song',
		songDocs.map((song) => song.ref)
	)

	if (playsInDocs.length === 0) return musiciansForSongs

	// Get all the participants that play these songs
	const participantIds = playsInDocs.map((doc) => doc.ref.parent.parent?.id as string)
	const participantDocs = await Promise.all(
		participantIds.map((id) => getDoc(doc(db, 'users/' + id)))
	)
	const participants = participantDocs.map(
		(participant) =>
			({
				id: participant.id,
				...participant.data()
			} as User)
	)

	// Add them to the dictionary for the songs they play
	for (const playsInSong of playsInDocs) {
		const participant = participants.find((x) => x.id === playsInSong.ref.parent.parent?.id)
		if (!participant) throw new Error('Participant was not loaded, something is wrong')

		const playsInSongData = playsInSong.data()

		// Add musician
		const musician = {
			participantName: participant.name,
			instrumentName: playsInSongData.part,
			participantId: participant.id
		}

		musiciansForSongs[playsInSongData.song.id].push(musician)
	}

	return musiciansForSongs
}
