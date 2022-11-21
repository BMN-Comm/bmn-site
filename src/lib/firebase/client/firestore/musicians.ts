import { db } from '$lib/firebase/client/firebase'
import type { user } from '$lib/types/domain/user'
import { collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore'

/** Get a dictionary of the musicians that play on the given songs */
export async function GetMusisciansThatPlaySongs(ids: string[]) {
	const musiciansForSongs: {
		[songId: string]: { participantName: string; instrumentName: string; participantId: string }[]
	} = {}

	// Get the song objects from the rehearsal songs
	const songDocs = await Promise.all(ids.map((id) => getDoc(doc(db, 'songs/' + id))))

	if (songDocs.length === 0) return musiciansForSongs

	// Init all songs so they don't dissappear
	for (const song of songDocs) {
		musiciansForSongs[song.id] = []
	}

	// Get the playsSongInEdition for all participants on this rehearsal day
	const playsInQuery = query(
		collectionGroup(db, 'playsSongInEdition'),
		where(
			'song',
			'in',
			songDocs.map((song) => song.ref)
		)
	)
	const playsInDocs = (await getDocs(playsInQuery)).docs

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
			} as user)
	)

	// Add them to the dictionary for the songs they play
	for (const playsInSong of playsInDocs) {
		const participant = participants.find((x) => x.id === playsInSong.ref.parent.parent?.id)
		if (!participant) throw new Error('Participant was not loaded, something is wrong')

		const playsInSongData = playsInSong.data()

		// Add musician
		musiciansForSongs[playsInSongData.song.id].push({
			participantName: participant.name,
			instrumentName: playsInSongData.part,
			participantId: participant.id
		})
	}

	return musiciansForSongs
}
