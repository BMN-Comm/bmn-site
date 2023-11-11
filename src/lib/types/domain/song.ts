import type { Timestamp, DocumentReference } from 'firebase/firestore'

export type Song = {
	id: string
	name: string
	artist: string
	link: string
	length: string
	genre: string
}

export type SuggestedSong = Song & {
	remark: string
	suggestionDate: Timestamp
	user: DocumentReference // Reference to user path
	liked: boolean
}

/** All the state for creating a new song in the database with empty fields. */
export const emptyNewSong: Omit<Song, 'id'> = {
	name: '',
	artist: '',
	link: '',
	length: '',
	genre: ''
}
