import type { availability } from '$lib/types/domain/availability'

export const bmnAdminUserId = 'Om9orRRBrIkeXhHTHELj'

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

/**
 * Unknown user placeholder. It exists only to stop the svelte compiler from complaining about a possibly undefined value where our business logic dictates that it actually always will be defined.
 */
export const unknownUser: user = {
	id: '',
	email: 'unknown@user.com',
	name: 'Unknown',
	playsInstruments: [],
	playsSongs: [],
	availability: []
}
