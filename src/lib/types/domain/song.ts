import type { Timestamp, DocumentReference } from 'firebase/firestore'

export type Song = {
	id: string
	name: string
	artist: string
	link: string
}

export type SongSuggestion = Omit<SuggestedSong, 'id' | 'liked'>

export type SuggestedSong = Song & {
	length: string
	genre: string
	remark: string
	suggestionDate: Timestamp
	user: DocumentReference // Reference to user path
	liked: boolean
}
