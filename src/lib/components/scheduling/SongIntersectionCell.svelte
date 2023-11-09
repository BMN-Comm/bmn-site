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

	export let position: [number, number]
	export let columns: number

	export let songs: [string, string]
	export let musicians: [Musician[], Musician[]]

	let intersection = calculateMusicianIntersection(musicians[0], musicians[1])

	let colorClass =
		position[0] === position[1]
			? 'black-cell'
			: Object.entries(intersection).length > 0
			? 'red-cell'
			: 'green-cell'

	// When the two songs are the same or the intersection between the songs is empty, no tooltip is needed
	let withTooltip = position[0] !== position[1] && Object.entries(intersection).length > 0
	let toolTipOpen = false

	type MusicianIntersection = {
		[participant: string]: { instrumentsSong1: Set<string>; instrumentsSong2: Set<string> }
	}

	function calculateMusicianIntersection(
		musiciansSong1: Musician[],
		musiciansSong2: Musician[]
	): MusicianIntersection {
		// Create an empty dictionary
		let intersection: MusicianIntersection = {}

		// For each musician in song 1, check if they are also in song 2
		for (let musician1 of musiciansSong1) {
			for (let musician2 of musiciansSong2) {
				if (musician1.participantName === musician2.participantName) {
					// If the musician is in both songs, add them to the dictionary (if not already present)
					if (!intersection[musician1.participantName]) {
						intersection[musician1.participantName] = {
							instrumentsSong1: new Set(),
							instrumentsSong2: new Set()
						}
					}

					// Add their instruments to the sets in the dictionary
					intersection[musician1.participantName].instrumentsSong1.add(musician1.instrumentName)
					intersection[musician1.participantName].instrumentsSong2.add(musician2.instrumentName)
				}
			}
		}

		return intersection
	}

	function getFirstName(name: string): string {
		return name.split(' ')[0]
	}

	// To avoid the tooltip being cut off, we need to align it sometimes on the left and sometimes on the right
	function calculatePopoverAlign() {
		if (position[1] < 2) {
			return 'bottom-left'
		} else if (position[1] > columns - 4) {
			return 'bottom-right'
		} else {
			return 'bottom'
		}
	}
</script>

<StructuredListCell
	class="middle-cell fixed-table-cell {colorClass}"
	on:mouseenter={() => {
		if (withTooltip) {
			toolTipOpen = true
		}
	}}
	on:mouseleave={() => {
		toolTipOpen = false
	}}
	on:click={() => {
		if (withTooltip) {
			toolTipOpen = !toolTipOpen
		}
	}}
>
	<Popover caret bind:open={toolTipOpen} align={calculatePopoverAlign()}>
		<StructuredList>
			<StructuredListHead>
				<StructuredListRow head>
					<FixedWidthCell head>Name</FixedWidthCell>
					<FixedWidthCell head>{songs[0]}</FixedWidthCell>
					<FixedWidthCell head>{songs[1]}</FixedWidthCell>
				</StructuredListRow>
			</StructuredListHead>

			<StructuredListBody>
				{#each Object.entries(intersection) as [musicianName, instruments]}
					{@const instrumentsSong1 = [...instruments.instrumentsSong1.values()]}
					{@const instrumentsSong2 = [...instruments.instrumentsSong2.values()]}
					<StructuredListRow>
						<FixedWidthCell>
							{getFirstName(musicianName)}
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
