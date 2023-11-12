import type { DocumentReference, Timestamp } from 'firebase/firestore'

export type Availability = {
	id: string
} & NewAvailability

export type NewAvailability = {
	available: boolean
	startTime: Timestamp
	endTime: Timestamp
	rehearsal: DocumentReference
	reason?: string
}
