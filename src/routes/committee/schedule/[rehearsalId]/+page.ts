import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import type { edition } from '$lib/types/domain/edition'
import type { rehearsal, rehearsalSong } from '$lib/types/domain/rehearsal'
import type { song } from '$lib/types/domain/song'
import {
	query,
	collection,
	orderBy,
	getDocs,
	doc,
	getDoc,
	collectionGroup
} from 'firebase/firestore'
import type { PageLoad } from './$types'
import type { user } from '$lib/types/domain/user'
import { QueryWhereIn } from '$lib/util/queryWhereIn'

export const ssr = false

export const load: PageLoad = async ({ params }) => {
	await verifyUserLoggedIn()

	// Get the rehearsal
	const rehearsalDoc = doc(db, 'rehearsals/', params.rehearsalId)
	const rehearsal = { id: rehearsalDoc.id, ...(await getDoc(rehearsalDoc)).data() } as rehearsal

	// Get all the songs that need to be rehearsed on this day
	const rehearsalSongsQuery = query(
		collection(rehearsalDoc, 'songsToRehearse'),
		orderBy('startTime')
	)
	rehearsal.songsToRehearse = (await getDocs(rehearsalSongsQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as rehearsalSong)
	)

	let songs

	const musiciansForSongs: {
		[songId: string]: { participantName: string; instrumentName: string }[]
	} = {}

	if (rehearsal.songsToRehearse.length > 0) {
		// Get the document ids of the songs
		const songIds = rehearsal.songsToRehearse.map((rehearsalSong) => rehearsalSong.song.id)

		// Get the song objects from the rehearsal songs
		const songDocs = await QueryWhereIn(collection(db, 'songs'), '__name__', songIds)
		songs = songDocs.map((doc) => ({ id: doc.id, ...doc.data() } as song))

		const playsInDocs = await QueryWhereIn(
			collectionGroup(db, 'playsSongInEdition'),
			'song',
			songDocs.map((song) => song.ref)
		)

		// Get all the participants that play these songs
		const participantIds = playsInDocs.map((doc) => doc.ref.parent.parent?.id as string)
		const participantDocs = await QueryWhereIn(collection(db, 'users'), '__name__', participantIds)
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
			// Create array if not exists
			if (!musiciansForSongs[playsInSongData.song.id])
				musiciansForSongs[playsInSongData.song.id] = []

			// Add musician
			musiciansForSongs[playsInSongData.song.id].push({
				participantName: participant.name,
				instrumentName: playsInSongData.part
			})
		}
	}

	// Get all songs of the edition -- TODO: Auto current edition?
	const edition = (await getDoc(doc(db, 'editions/ZI3Eab1mXjHvCUS47o40'))).data() as edition
	const songRefs = edition.songs.map((ref) => ref.id)

	const editionSongsDocs = await QueryWhereIn(collection(db, 'songs'), '__name__', songRefs)
	const editionSongs = editionSongsDocs.map((doc) => ({ id: doc.id, ...doc.data() } as song))

	return {
		rehearsal,
		songs,
		musicians: musiciansForSongs,
		editionSongs
	}
}
