import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type rehearsal = {
	id: string
	edition: string // Reference to edition
	startTime: Timestamp
	endTime: Timestamp
	location: string
	songsToRehearse: {
		song: DocumentReference // Reference to song
		startTime: Timestamp
		endTime: Timestamp
	}
}
