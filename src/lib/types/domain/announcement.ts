import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type Announcement = {
	id: string
} & NewAnnouncement

export type NewAnnouncement = {
	publishDate: Timestamp
	title: string
	content: string
	authorUser: DocumentReference // Reference to user
}
