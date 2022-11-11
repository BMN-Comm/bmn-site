import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type announcement = {
	id: string
} & newAnnouncement

export type newAnnouncement = {
	edition: DocumentReference // Reference to edition
	publishDate: Timestamp
	title: string
	content: string
	authorUser: DocumentReference // Reference to user
}
