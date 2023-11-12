import type { DocumentReference } from 'firebase/firestore'

// There is always only 1 edition, to keep track of the songs that are played. Maybe make this env variable at some point.
export const editionId = 'editions/ZI3Eab1mXjHvCUS47o40'

export type Edition = {
	id: string
	songs: DocumentReference[]
}
