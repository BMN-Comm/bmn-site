import { db, verifyUserLoggedIn } from '$lib/firebase/client/firebase'
import { GetMusisciansThatPlaySongs } from '$lib/firebase/client/firestore/musicians'
import { getSongs } from '$lib/firebase/client/firestore/songs'
import { GetAllUsers } from '$lib/firebase/client/firestore/users'
import { editionId, type edition } from '$lib/types/domain/edition'
import { doc, getDoc } from 'firebase/firestore'
import type { PageLoad } from './$types'
import { getInstruments } from '$lib/firebase/client/firestore/instruments'

export const ssr = false

export const load: PageLoad = async () => {
	await verifyUserLoggedIn()

	const instruments = await getInstruments()

	return { instruments }
}
