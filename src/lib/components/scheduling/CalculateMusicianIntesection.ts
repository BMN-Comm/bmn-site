import type { Musician } from '$lib/types/domain/musician'
import _ from 'lodash'

export type SongWithMusicians = { name: string; musicians: Musician[] }

type ConflictingParticipant = {
	name: string
	instrumentsSong1: string[]
	instrumentsSong2: string[]
}

type SongIntersection = {
	hasConflict: boolean
	conflictingParticipants: ConflictingParticipant[]
	conflictingBandcoachParticipants: ConflictingParticipant[]
	conflictingMusicianParticipants: ConflictingParticipant[]
}

export function calculateMusicianIntersection(
	song1: SongWithMusicians,
	song2: SongWithMusicians
): SongIntersection {
	const conflictingMusicians = _.intersectionBy(
		song1.musicians,
		song2.musicians,
		(musician) => musician.participantName
	)

	const conflictingParticipants: ConflictingParticipant[] = conflictingMusicians.map((musician) => {
		const instrumentsSong1 = song1.musicians
			.filter((x) => x.participantName === musician.participantName)
			.map((x) => x.instrumentName)
		const instrumentsSong2 = song2.musicians
			.filter((x) => x.participantName === musician.participantName)
			.map((x) => x.instrumentName)
		return { name: musician.participantName, instrumentsSong1, instrumentsSong2 }
	})

	const [conflictingBandcoachParticipants, conflictingMusicianParticipants] = _.partition(
		conflictingParticipants,
		(participant) =>
			_.includes(participant.instrumentsSong1.map(_.toLower), 'bandcoach') ||
			_.includes(participant.instrumentsSong2.map(_.toLower), 'bandcoach')
	)

	return {
		hasConflict: conflictingParticipants.length > 0,
		conflictingParticipants,
		conflictingBandcoachParticipants,
		conflictingMusicianParticipants
	}
}
