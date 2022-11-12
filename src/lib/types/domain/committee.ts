import type { DocumentReference } from 'firebase/firestore'

export type committee = {
	year: number
	likesSongs: DocumentReference[] // List of references to song
	usersInCommittee: {
		user: string // reference to user
		role: string
	}[]
}
