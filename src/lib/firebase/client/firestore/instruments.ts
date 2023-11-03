import { db } from '$lib/firebase/client/firebase'
import { collection, getDocs, query } from 'firebase/firestore'
import type { Instrument } from '$lib/types/domain/instrument'

/** Get data of all the instruments */
export async function getInstruments() {
	const usersQuery = query(collection(db, 'instruments'))
	return (await getDocs(usersQuery)).docs.map(
		(instrument) => ({ id: instrument.id, ...instrument.data() } as Instrument)
	)
}
