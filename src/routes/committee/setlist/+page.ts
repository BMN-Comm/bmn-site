import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import type { edition } from '$lib/types/domain/edition'
import type { playsSong, song } from '$lib/types/domain/song'
import type { user } from '$lib/types/domain/user'
import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	// TODO: use current edition
	const editionRef = doc(db, 'editions', 'ZI3Eab1mXjHvCUS47o40')
	const edition = (await getDoc(editionRef)).data() as edition

	const editionSongs = edition.songs.map((s) => s.id)

	const songsQuery = query(collection(db, 'songs'), where('__name__', 'in', editionSongs))
	const songs = (await getDocs(songsQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as song)
	)

	let musiciansForSongs: {
		[songId: string]: { participantName: string; instrumentName: string }[]
	} = {}

	// Get the playsSongInEdition for all participants on this rehearsal day
	const sRef = editionSongs.map((item) => doc(db, 'songs/' + item))

	const playsInQuery = query(collectionGroup(db, 'playsSongInEdition'), where('song', 'in', sRef))
	const playsInDocs = (await getDocs(playsInQuery)).docs
	const playsInRefs = playsInDocs.map((doc) => ({ id: doc.id, ...doc.data() } as playsSong))

	if (playsInRefs.length < 1) {
		return {
			songs,
			musiciansForSongs
		}
	}

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

	const usersQuery = query(collection(db, 'users'))
	const users = (await getDocs(usersQuery)).docs.map(
		(user) => ({ id: user.id, ...user.data() } as user)
	)

	return { songs, musiciansForSongs, users, namesMap }
}
