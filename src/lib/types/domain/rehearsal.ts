import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type Rehearsal = {
	id: string
	rooms: RehearsalRoom[]
	songsToRehearse: RehearsalSong[]
} & RehearsalInfo

export type RehearsalInfo = {
	startTime: Timestamp
	endTime: Timestamp
	location: string
}

export type RehearsalRoom = {
	id: string
} & RehearsalRoomInfo

export type RehearsalRoomInfo = {
	startTime: Timestamp
	endTime: Timestamp
	roomName: string
	songsToRehearse: RehearsalSong[]
}

export type RehearsalSong = {
	id: string
} & RehearsalSongInfo

export type RehearsalSongInfo = {
	startTime: Timestamp
	endTime: Timestamp
	song: DocumentReference
}
