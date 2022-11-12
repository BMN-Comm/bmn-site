import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import type { playsSong, song } from '$lib/types/domain/song'
import type { user } from '$lib/types/domain/user'
import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async ({ params, parent }) => {
	await verifyUserLoggedIn()

	const currentUserId: string = (await parent()).user.databaseId
	const musiciansForSongs: {
		[songId: string]: { participantName: string; instrumentName: string }[]
	} = {}

	// Get all the user's songs
	const playsSongQuery = query(collection(db, 'users', currentUserId, 'playsSongInEdition'))
	const playsSongDocs = (await getDocs(playsSongQuery)).docs
	const playsSongs = playsSongDocs.map(
		(song) =>
			({
				id: song.id,
				...song.data()
			} as playsSong)
	)

	const songsRefs = playsSongs.map((song) => song.song)
	const songsIds = songsRefs.map((ref) => ref.id)
	const songsDocs = (
		await getDocs(query(collection(db, 'songs'), where('__name__', 'in', songsIds)))
	).docs
	const songs = songsDocs.map((doc) => ({ id: doc.id, ...doc.data() } as song))

	if (playsSongs.length < 1) {
		return {
			playsSongs,
			musiciansForSongs
		}
	}

	// Get all users on the songs
	const playsSongInEditionQuery = query(
		collectionGroup(db, 'playsSongInEdition'),
		where('song', 'in', songsRefs)
	)

	const playsSongInEditionDocs = (await getDocs(playsSongInEditionQuery)).docs

	// Get all the participants that play these songs
	const participantIds = playsSongInEditionDocs.map((doc) => doc.ref.parent.parent?.id as string)

	const participantQuery = query(collection(db, 'users'), where('__name__', 'in', participantIds))
	const participants = (await getDocs(participantQuery)).docs.map(
		(participant) =>
			({
				id: participant.id,
				...participant.data()
			} as user)
	)

	// Add them to the dictionary for the songs they play
	for (const playsInSong of playsSongInEditionDocs) {
		const participant = participants.find((x) => x.id === playsInSong.ref.parent.parent?.id)
		if (!participant) throw new Error('Participant was not loaded, something is wrong')

		const playsInSongData = playsInSong.data()
		// Create array if not exists
		if (!musiciansForSongs[playsInSongData.song.id]) musiciansForSongs[playsInSongData.song.id] = []

		// Add musician
		musiciansForSongs[playsInSongData.song.id].push({
			participantName: participant.name,
			instrumentName: playsInSongData.part
		})
	}

	return {
		songs,
		musiciansForSongs
	}
}
