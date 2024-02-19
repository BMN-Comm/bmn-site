<script lang="ts">
	import {
		calculateMusicianIntersection,
		type SongWithMusicians
	} from '$lib/components/scheduling/CalculateMusicianIntesection'
	import FixedWidthCell from '$lib/components/scheduling/FixedWidthCell.svelte'
	import {
		Popover,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import type { PopoverProps } from 'carbon-components-svelte/types/Popover/Popover.svelte'
	import _ from 'lodash'

	export let columnIndex: number
	export let rowIndex: number
	export let columns: number

	export let song1: SongWithMusicians
	export let song2: SongWithMusicians

	let songsAreTheSame = rowIndex === columnIndex

	let songIntersection = calculateMusicianIntersection(song1, song2)

	let cellColorClass = songsAreTheSame
		? 'black-cell'
		: songIntersection.conflictingMusicianParticipants.length > 0
		? 'red-cell'
		: songIntersection.conflictingBandcoachParticipants.length > 0
		? 'orange-cell'
		: 'green-cell'

	// When the two songs are the same or there is no conflict between the songs, no tooltip is needed
	let withTooltip = songsAreTheSame && songIntersection.hasConflict
	let toolTipOpen = false
	let toolTipAlign: PopoverProps['align'] =
		columnIndex < 2 ? 'bottom-left' : columnIndex > columns - 4 ? 'bottom-right' : 'bottom'
</script>

<StructuredListCell
	class="middle-cell fixed-table-cell {cellColorClass}"
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
