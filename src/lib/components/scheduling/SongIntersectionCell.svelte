<script lang="ts">
	import FixedWidthCell from '$lib/components/scheduling/FixedWidthCell.svelte'
	import type { Musician } from '$lib/types/domain/musician'
	import {
		Popover,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import _ from 'lodash'

	type SongWithMusicians = { name: string; musicians: Musician[] }

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

	export let columnIndex: number
	export let rowIndex: number
	export let columns: number

	export let song1: SongWithMusicians
	export let song2: SongWithMusicians

	let songIntersection = calculateMusicianIntersection(song1, song2)

	let colorClass =
		rowIndex === columnIndex
			? 'black-cell'
			: songIntersection.conflictingMusicianParticipants.length > 0
			? 'red-cell'
			: songIntersection.conflictingBandcoachParticipants.length > 0
			? 'orange-cell'
			: 'green-cell'

	// When the two songs are the same or there is no conflict between the songs, no tooltip is needed
	let withTooltip = rowIndex !== columnIndex && songIntersection.hasConflict
	let toolTipOpen = false
	let toolTipAlign: 'bottom' | 'bottom-left' | 'bottom-right' =
		columnIndex < 2 ? 'bottom-left' : columnIndex > columns - 4 ? 'bottom-right' : 'bottom'

	function calculateMusicianIntersection(
		song1: SongWithMusicians,
		song2: SongWithMusicians
	): SongIntersection {
		const conflictingMusicians = _.intersectionBy(
			song1.musicians,
			song2.musicians,
			(musician) => musician.participantName
		)

		const conflictingParticipants: ConflictingParticipant[] = conflictingMusicians.map(
			(musician) => {
				const instrumentsSong1 = song1.musicians
					.filter((x) => x.participantName === musician.participantName)
					.map((x) => x.instrumentName)
				const instrumentsSong2 = song2.musicians
					.filter((x) => x.participantName === musician.participantName)
					.map((x) => x.instrumentName)
				return { name: musician.participantName, instrumentsSong1, instrumentsSong2 }
			}
		)

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
</script>

<StructuredListCell
	class="middle-cell fixed-table-cell {colorClass}"
	on:mouseenter={() => {
		if (withTooltip) toolTipOpen = true
	}}
	on:mouseleave={() => {
		toolTipOpen = false
	}}
	on:click={() => {
		if (withTooltip) toolTipOpen = !toolTipOpen
	}}
>
	<Popover caret bind:open={toolTipOpen} align={toolTipAlign}>
		<StructuredList>
			<StructuredListHead>
				<StructuredListRow head>
					<FixedWidthCell head>Name</FixedWidthCell>
					<FixedWidthCell head>{song1.name}</FixedWidthCell>
					<FixedWidthCell head>{song2.name}</FixedWidthCell>
				</StructuredListRow>
			</StructuredListHead>

			<StructuredListBody>
				{#each songIntersection.conflictingParticipants as conflictingParticipant}
					<StructuredListRow>
						<FixedWidthCell>
							{conflictingParticipant.name.split(' ')[0]}
						</FixedWidthCell>
						<FixedWidthCell>
							{#each conflictingParticipant.instrumentsSong1 as instrument, i}
								{instrument}
								{#if i < conflictingParticipant.instrumentsSong1.length - 1}
									<br />
								{/if}
							{/each}
						</FixedWidthCell>
						<FixedWidthCell>
							{#each conflictingParticipant.instrumentsSong2 as instrument, i}
								{instrument}
								{#if i < conflictingParticipant.instrumentsSong2.length - 1}
									<br />
								{/if}
							{/each}
						</FixedWidthCell>
					</StructuredListRow>
				{/each}
			</StructuredListBody>
		</StructuredList>
	</Popover>
</StructuredListCell>

<style>
	:global(.middle-cell) {
		border-width: 1px;
	}

	:global(.red-cell) {
		background-color: rgb(243, 137, 137);
	}
	:global(.orange-cell) {
		background-color: rgb(255, 204, 153);
	}
	:global(.green-cell) {
		background-color: rgb(120, 193, 163);
	}
	:global(.black-cell) {
		background-color: rgb(22, 22, 22);
	}
</style>
