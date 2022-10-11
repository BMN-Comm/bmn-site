export type user = {
	id: string
	email: string
	name: string
	playsInstruments: { name: string }[]
	playsSongInEdition: {
		song: string // Reference to song
		edition: string // Reference to edition
		part: string
	}[]
	availibility: {
		rehearsal: string // Reference to rehearsal
		startTime: string
		endTime: string
		available: boolean
		reason?: string
	}[]
}
