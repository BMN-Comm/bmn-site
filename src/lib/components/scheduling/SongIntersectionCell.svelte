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

	export let columnIndex: number
	export let rowIndex: number
	export let columns: number

	type SongWithMusicians = { name: string; musicians: Musician[] }

	export let song1: SongWithMusicians
	export let song2: SongWithMusicians

	let conflictingParticipants = calculateMusicianIntersection(song1, song2)

	let colorClass =
		rowIndex === columnIndex
			? 'black-cell'
			: conflictingParticipants.length > 0
			? 'red-cell'
			: 'green-cell'

	// When the two songs are the same or the intersection between the songs is empty, no tooltip is needed
	let withTooltip = rowIndex !== columnIndex && conflictingParticipants.length > 0
	let toolTipOpen = false
	let toolTipAlign: 'bottom' | 'bottom-left' | 'bottom-right' =
		columnIndex < 2 ? 'bottom-left' : columnIndex > columns - 4 ? 'bottom-right' : 'bottom'

	// Participant name, instruments played on song 1, instruments played on song 2
	type ConflictingParticipant = [string, string[], string[]]

	function calculateMusicianIntersection(
		song1: SongWithMusicians,
		song2: SongWithMusicians
	): ConflictingParticipant[] {
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
				return [musician.participantName, instrumentsSong1, instrumentsSong2]
			}
		)

		return conflictingParticipants
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
				{#each conflictingParticipants as [participantName, instrumentsSong1, instrumentsSong2]}
					<StructuredListRow>
						<FixedWidthCell>
							{participantName.split(' ')[0]}
						</FixedWidthCell>
						<FixedWidthCell>
							{#each instrumentsSong1 as instrument, i}
								{instrument}
								{#if i < instrumentsSong1.length - 1}
									<br />
								{/if}
							{/each}
						</FixedWidthCell>
						<FixedWidthCell>
							{#each instrumentsSong2 as instrument, i}
								{instrument}
								{#if i < instrumentsSong2.length - 1}
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
	:global(.green-cell) {
		background-color: rgb(120, 193, 163);
	}
	:global(.black-cell) {
		background-color: rgb(22, 22, 22);
	}
</style>
