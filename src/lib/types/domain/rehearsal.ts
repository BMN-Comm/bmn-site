import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type rehearsal = {
	id: string
	songsToRehearse: rehearsalSong[]
} & newRehearsal

export type newRehearsal = {
	edition: DocumentReference // Reference to edition
	startTime: Timestamp
	endTime: Timestamp
	location: string
}

export type rehearsalSong = {
	id: string
} & newRehearsalSong

export type newRehearsalSong = {
	startTime: Timestamp
	endTime: Timestamp
	song: DocumentReference
}
