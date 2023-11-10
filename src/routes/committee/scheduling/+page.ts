import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { GetMusisciansThatPlaySongs } from '$lib/firebase/client/firestore/musicians'
import { getSongs } from '$lib/firebase/client/firestore/songs'
import { getUsers } from '$lib/firebase/client/firestore/users'
import { editionId, type edition } from '$lib/types/domain/edition'
import { doc, getDoc } from 'firebase/firestore'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	const editionRef = doc(db, editionId)
	const edition = (await getDoc(editionRef)).data() as edition

	const editionSongIds = edition.songs.map((s) => s.id)

	const songs = await getSongs(editionSongIds)

	const musiciansForSongs = GetMusisciansThatPlaySongs(editionSongIds)

	const users = getUsers()

	return { songs, musiciansForSongs, users }
}
