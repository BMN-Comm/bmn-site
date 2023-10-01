import type { availability } from '$lib/types/domain/availability'

export type user = {
	id: string
	email: string
	name: string
	playsInstruments: { name: string }[]
	playsSongs: {
		song: string // Reference to song
		part: string
	}[]
	availability: availability[]
}
