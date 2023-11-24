import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { GetMusisciansThatPlaySongs } from '$lib/firebase/client/firestore/musicians'
import { getSongs } from '$lib/firebase/client/firestore/songs'
import type { Rehearsal, RehearsalRoom, RehearsalSong } from '$lib/types/domain/rehearsal'
import { query, collection, orderBy, getDocs, doc, getDoc } from 'firebase/firestore'
import type { PageLoad } from './$types'
import { toDict } from '$lib/util/dict'

export const ssr = false

export const load: PageLoad = async ({ params }) => {
	await verifyUserLoggedIn()

	// Get the rehearsal
	const rehearsalDoc = doc(db, 'rehearsals/', params.rehearsalId)
	const rehearsal = { id: rehearsalDoc.id, ...(await getDoc(rehearsalDoc)).data() } as Rehearsal

	// Get all the rooms of a rehearsal
	const rehearsalRoomsQuery = query(collection(rehearsalDoc, 'rooms'), orderBy('startTime'))
	const roomDocs = (await getDocs(rehearsalRoomsQuery)).docs
	const rooms = roomDocs.map((doc) => ({ id: doc.id, ...doc.data() } as RehearsalRoom))

	// For each room, get the songs that should be rehearsed
	roomDocs.forEach(async (roomDoc, i) => {
		const roomSongsQuery = query(collection(roomDoc.ref, 'songsToRehearse'), orderBy('startTime'))
		rooms[i].songsToRehearse = (await getDocs(roomSongsQuery)).docs.map(
			(doc) => ({ id: doc.id, ...doc.data() } as RehearsalSong)
		)
	})

	rehearsal.rooms = rooms

	// Get all the songs that need to be rehearsed on this day
	const rehearsalSongsQuery = query(
		collection(rehearsalDoc, 'songsToRehearse'),
		orderBy('startTime')
	)
	rehearsal.songsToRehearse = (await getDocs(rehearsalSongsQuery)).docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as RehearsalSong)
	)

	// Get the unique document ids of the songs
	const songIds = rehearsal.rooms
		.flatMap((room) => room.songsToRehearse)
		.map((rehearsalSong) => rehearsalSong.song.id)
		.concat(rehearsal.songsToRehearse.map((rehearsalSong) => rehearsalSong.song.id))
		.filter((value, index, array) => array.indexOf(value) === index)

	const songs = toDict((await getSongs(songIds)).map((song) => ({ [song.id]: song })))

	await getSongs(songIds)

	const musiciansForSongs = await GetMusisciansThatPlaySongs(songIds)

	return {
		rehearsal,
		songs,
		musicians: musiciansForSongs
	}
}
