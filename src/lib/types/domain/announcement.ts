import type { Timestamp } from 'firebase/firestore'

export type announcement = {
	edition: string // Reference to edition
	publishDate: Timestamp
	title: string
	content: string
	authorUser: string // Reference to user
}
