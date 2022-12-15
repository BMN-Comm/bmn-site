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
	collectionGroup,
	where
} from 'firebase/firestore'
import type { PageLoad } from './$types'
import type { user } from '$lib/types/domain/user'
import { toDict } from '$lib/util/dict'
import type { availability } from '$lib/types/domain/availability'
import { QueryWhereInBatched } from '$lib/util/queryWhereIn'

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

	let availability

	const musiciansForSongs: {
		[songId: string]: { participantId: string; participantName: string; instrumentName: string }[]
	} = {}

	// Get all songs of the edition -- TODO: Auto current edition?
	const edition = (await getDoc(doc(db, 'editions/ZI3Eab1mXjHvCUS47o40'))).data() as edition
	const songRefs = edition.songs.map((ref) => ref.id)

	const editionSongsDocs = await QueryWhereInBatched(collection(db, 'songs'), '__name__', songRefs)
	const songs = editionSongsDocs.map((doc) => ({ id: doc.id, ...doc.data() } as song))

	if (songs.length > 0) {
		const playsInDocs = await QueryWhereInBatched(
			collectionGroup(db, 'playsSongInEdition'),
			'song',
			editionSongsDocs.map((song) => song.ref)
		)

		// Get all the participants that play these songs
		const participantIds = playsInDocs.map((doc) => doc.ref.parent.parent?.id as string)
		const participantDocs = await QueryWhereInBatched(
			collection(db, 'users'),
			'__name__',
			participantIds
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
			// Create array if not exists
			if (!musiciansForSongs[playsInSongData.song.id])
				musiciansForSongs[playsInSongData.song.id] = []

			// Add musician
			musiciansForSongs[playsInSongData.song.id].push({
				participantId: participant.id,
				participantName: participant.name,
				instrumentName: playsInSongData.part
			})
		}

		const availabilityQuery = query(
			collectionGroup(db, 'availability'),
			where('rehearsal', '==', doc(db, 'rehearsals/', params.rehearsalId))
		)
		const allAvailability = (await getDocs(availabilityQuery)).docs

		availability = toDict(
			participantIds.map((participantId) => ({
				[participantId]: allAvailability
					.find((x) => x.ref.parent.parent!.id === participantId)
					?.data() as availability | undefined
			}))
		)
	}

	return {
		rehearsal,
		songs,
		musiciansForSongs,
		availabilityForMusicians: availability ?? {}
	}
}
