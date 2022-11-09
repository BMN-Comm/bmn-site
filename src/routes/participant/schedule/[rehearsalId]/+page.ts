import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import type { rehearsal, rehearsalSong } from '$lib/types/domain/rehearsal'
import type { song } from '$lib/types/domain/song'
import {
	query,
	collection,
	orderBy,
	getDocs,
	DocumentReference,
	doc,
	getDoc,
	collectionGroup,
	where
} from 'firebase/firestore'
import type { PageLoad } from './$types'

export const ssr = false

type playsSong = {
	id: string
	edition: DocumentReference
	part: string
	song: DocumentReference
}

export const load: PageLoad = async ({ params }) => {
	await verifyUserLoggedIn()

	const rehearsal = (await getDoc(doc(db, 'rehearsals/', params.rehearsalId))).data() as rehearsal

	// Get all the songs that need to be rehearsed on this day
	const rehearsalSongsQuery = query(
		collection(db, 'rehearsals/' + params.rehearsalId + '/songsToRehearse'),
		orderBy('startTime')
	)
	const rehearsalSongs = (await getDocs(rehearsalSongsQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as rehearsalSong)
	)

	// Get the document ids of the songs
	const s = rehearsalSongs.map((rehearsalSong) => rehearsalSong.song.id)

	if (s.length < 1) {
		return {
			rehearsal: rehearsal,
			rehearsalId: params.rehearsalId,
			rehearsalSongs: rehearsalSongs,
			songs: [],
			musicians: []
		}
	}

	// Get the song objects from the rehearsal songs
	const songsQuery = query(collection(db, 'songs'), where('__name__', 'in', s))
	const songs = (await getDocs(songsQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as song)
	)

	let musiciansForSongs: {
		[songId: string]: { participantName: string; instrumentName: string }[]
	} = {}

	// Get the playsSongInEdition for all participants on this rehearsal day
	const sRef = s.map((item) => doc(db, 'songs/' + item))
	const playsInQuery = query(collectionGroup(db, 'playsSongInEdition'), where('song', 'in', sRef))
	const playsInDocs = (await getDocs(playsInQuery)).docs
	const playsInRefs = playsInDocs.map((doc) => ({ id: doc.id, ...doc.data() } as playsSong))

	// Get the participants ids, as they are the parents of the playsSongInEditions
	const parents = playsInDocs.map((doc) => doc.ref.parent.parent?.id as string)

	// Map user document id to user name
	let namesMap: { [userId: string]: { participantName: string } } = {}

	// Get the participants documents
	const participantQuery = query(collection(db, 'users'), where('__name__', 'in', parents))
	const _ = (await getDocs(participantQuery)).docs.forEach((doc) => {
		namesMap[doc.id] = doc.data().name
	})

	// For each song, add the [participant, instrument] tuple to it's key in the map
	for (let i = 0; i < playsInRefs.length; i++) {
		let sid = playsInRefs[i].song.id
		let m = musiciansForSongs[sid]
		let p: { participantName: string; instrumentName: string }[] = []

		// TODO: Rienk haal kringeltjes weg/ refactor :)
		if (m != undefined) {
			p = [...m, [namesMap[parents[i]]!, playsInRefs[i].part]]
		} else {
			p = [[namesMap[parents[i]]!, playsInRefs[i].part]]
		}

		musiciansForSongs[sid] = p!
	}

	return {
		rehearsal: rehearsal,
		rehearsalId: params.rehearsalId,
		rehearsalSongs: rehearsalSongs,
		songs: songs,
		musicians: musiciansForSongs
	}
}
