import type { availability } from './availability'

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
	availability: availability
}
