import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type rehearsal = {
	id: string
	edition: DocumentReference // Reference to edition
	startTime: Timestamp
	endTime: Timestamp
	location: string
	songsToRehearse: {
		song: DocumentReference // Reference to song
		startTime: Timestamp
		endTime: Timestamp
	}
}

export type rehearsalSong = {
	id: string
} & newRehearsalSong

export type newRehearsalSong = {
	startTime: Timestamp
	endTime: Timestamp
	song: DocumentReference
}
