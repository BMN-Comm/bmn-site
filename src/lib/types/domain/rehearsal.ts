import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type rehearsal = {
	id: string
	songsToRehearse: rehearsalSong[]
} & rehearsalInfo

export type rehearsalInfo = {
	edition: DocumentReference // Reference to edition
	startTime: Timestamp
	endTime: Timestamp
	location: string
}

export type rehearsalSong = {
	id: string
} & rehearsalSongInfo

export type rehearsalSongInfo = {
	startTime: Timestamp
	endTime: Timestamp
	song: DocumentReference
}
