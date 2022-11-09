import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type availability = {
	id: string
} & newAvailability

export type newAvailability = {
	available: boolean
	startTime: Timestamp
	endTime: Timestamp
	rehearsal: DocumentReference
	reason: string
}
