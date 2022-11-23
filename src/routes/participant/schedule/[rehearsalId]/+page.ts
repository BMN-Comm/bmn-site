import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { GetMusisciansThatPlaySongs } from '$lib/firebase/client/firestore/musicians'
import { getSongs } from '$lib/firebase/client/firestore/songs'
import type { rehearsal, rehearsalSong } from '$lib/types/domain/rehearsal'
import { query, collection, orderBy, getDocs, doc, getDoc } from 'firebase/firestore'
import type { PageLoad } from './$types'

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

	// Get the document ids of the songs
	const songIds = rehearsal.songsToRehearse.map((rehearsalSong) => rehearsalSong.song.id)

	const songs = await getSongs(songIds)

	const musiciansForSongs = await GetMusisciansThatPlaySongs(songIds)

	return {
		rehearsal,
		songs,
		musicians: musiciansForSongs
	}
}
