import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { GetMusisciansThatPlaySongs } from '$lib/firebase/client/firestore/musicians'
import { getSongs } from '$lib/firebase/client/firestore/songs'
import type { edition } from '$lib/types/domain/edition'
import { doc, getDoc } from 'firebase/firestore'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	// TODO: use current edition
	const editionRef = doc(db, 'editions', 'ZI3Eab1mXjHvCUS47o40')
	const edition = (await getDoc(editionRef)).data() as edition

	const editionSongIds = edition.songs.map((s) => s.id)

	const songs = await getSongs(editionSongIds)

	const musiciansForSongs = await GetMusisciansThatPlaySongs(editionSongIds)

	return { songs, musiciansForSongs }
}
