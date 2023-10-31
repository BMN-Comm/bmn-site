import type { Timestamp, DocumentReference } from 'firebase/firestore'

export type song = {
	id: string
	name: string
	artist: string
	length: string
	link: string
	genre: string
	remark: string
	suggestionDate: Timestamp
	user: DocumentReference // Reference to user path,
	liked: boolean
}
