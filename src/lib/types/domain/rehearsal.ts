import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type rehearsal = {
	id: string
	rooms: rehearsalRoom[]
	songsToRehearse: rehearsalSong[]
} & rehearsalInfo

export type rehearsalInfo = {
	edition: DocumentReference // Reference to edition
	startTime: Timestamp
	endTime: Timestamp
	location: string
}

export type rehearsalRoom = {
	id: string
} & rehearsalRoomInfo

export type rehearsalRoomInfo = {
	startTime: Timestamp
	endTime: Timestamp
	roomName: string
	songsToRehearse: rehearsalSong[]
}

export type rehearsalSong = {
	id: string
} & rehearsalSongInfo

export type rehearsalSongInfo = {
	startTime: Timestamp
	endTime: Timestamp
	song: DocumentReference
}
