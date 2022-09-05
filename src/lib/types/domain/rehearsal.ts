export type rehearsal = {
	edition: string // Reference to edition
	startTime: string
	endTime: string
	location: string
	songsToRehearse: {
		song: string // Reference to song
		startTime: string
		endTime: string
	}
}
