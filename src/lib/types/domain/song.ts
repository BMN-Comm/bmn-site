import type { Timestamp } from 'firebase/firestore'

export type song = {
	name: string
	artist: string
	length: string
	link: string
	genre: string
	note: string
	suggestionDate: Timestamp
	user: string // Reference to user path
}
