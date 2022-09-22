import type { Timestamp } from "firebase/firestore"

export type rehearsal = {
	edition: string // Reference to edition
	startTime: Timestamp
	endTime: Timestamp
	location: string
	songsToRehearse: {
		song: string // Reference to song
		startTime: Timestamp
		endTime: Timestamp
	}
}
