import type { DocumentReference } from "firebase/firestore"

export type edition = {
	id: string
	year: number
	songs: DocumentReference[] // List of references to song path
	users: DocumentReference[] // List of references to user path
	concertDate?: string
	ticketLink?: string
	auditionLink?: string
}
