import type { Availability } from '$lib/types/domain/availability'

export const bmnAdminUserId = 'Om9orRRBrIkeXhHTHELj'

export type User = {
	id: string
	email: string
	name: string
	playsInstruments: { name: string }[]
	playsSongs: {
		song: string // Reference to song
		part: string
	}[]
	availability: Availability[]
}
