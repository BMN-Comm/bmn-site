<script lang="ts">
	import TimelineBlock from '$lib/components/scheduling/TimelineBlock.svelte'
	import type { rehearsalSong } from '$lib/types/domain/rehearsal'
	import type { song } from '$lib/types/domain/song'
	import { Column, Row } from 'carbon-components-svelte'

	export let roomStartTime: Date | undefined
	export let roomEndTime: Date | undefined

	export let startTime: Date
	export let endTime: Date

	export let songsToRehearse: rehearsalSong[]
	export let songs: song[]

	export let deleteSong: (songToDelete: string) => void

	const startMinutes = startTime.getHours() * 60 + startTime.getMinutes()

	const roomStartMinutes = roomStartTime
		? roomStartTime.getHours() * 60 + roomStartTime.getMinutes()
		: startMinutes
	const endMinutes = endTime.getHours() * 60 + endTime.getMinutes()
	const roomEndMinutes = roomEndTime
		? roomEndTime.getHours() * 60 + roomEndTime.getMinutes()
		: endMinutes

	const totalMinutes = endMinutes - startMinutes
	const roomTotalMinutes = roomEndTime ? roomEndMinutes - roomStartMinutes : totalMinutes

	// Create an array with the time intervals where we want to show time indications
	const helperIntervals = Array.from(Array(Math.floor(totalMinutes / 30))).map(
		(_, i) => new Date(startTime.getTime() + i * 30 * 60 * 1000)
	)

	// Create a list of songs along with range when it is planned, sorted by starting time
	$: songsWithPeriod = songsToRehearse
		.map((song) => {
			const songStartDate = song.startTime.toDate()
			const songEndDate = song.endTime.toDate()
			// From here on, we let the relative start and end be the minutes from the start of the rehearsal.
			const relativeStart =
				songStartDate.getHours() * 60 + songStartDate.getMinutes() - roomStartMinutes
			const relativeEnd = songEndDate.getHours() * 60 + songEndDate.getMinutes() - roomStartMinutes
			return {
				rehearsalSongId: song.id,
				relativeStart,
				relativeEnd,
				songId: song.song.id,
				length: relativeEnd - relativeStart
			}
		}) // For some reason js sorted incorrectly when using min, so I'm using this approach
		.sort((x, y) => (x.relativeStart > y.relativeStart ? -1 : 1))
		.reverse()
</script>

<!-- Helper row for indicating time -->
<Row class="helper-row">
	{#each helperIntervals as interval}
		<Column class="helper-column">
			{interval.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
		</Column>
	{/each}
</Row>
<!-- Row for songs that will be played -->
<Row class="timeline">
	<!-- If the room opens later then the rehearsal starts -->
	{#if roomStartMinutes > startMinutes}
		<TimelineBlock
			text="Room unavailable"
			relativeWidth={((roomStartMinutes - startMinutes) * 100) / totalMinutes}
		/>
	{/if}
	<!-- If there is free space at the beginning, or no songs at all, fill up the space -->
	{#if songsWithPeriod.length === 0 || songsWithPeriod[0].relativeStart > 0}
		<TimelineBlock
			relativeWidth={songsWithPeriod.length === 0
				? ((roomEndMinutes - roomStartMinutes) * 100) / totalMinutes
				: (songsWithPeriod[0].relativeStart * 100) / totalMinutes}
		/>
	{/if}
	{#each songsWithPeriod as songToRehearse, i}
		<!-- Render each song in the timeline -->
		<TimelineBlock
			relativeWidth={(songToRehearse.length * 100) / totalMinutes}
			song={songs.find((x) => x.id == songToRehearse.songId)}
			deleteSong={() => deleteSong(songToRehearse.rehearsalSongId)}
		/>
		<!-- If there is free space between the current block and the next, 
			or if the current block is the last block and does not end before the end of the rehearsal, add space. -->
		{#if (songsToRehearse.length === i + 1 && songToRehearse.relativeEnd < roomTotalMinutes) || (songsToRehearse.length > i + 1 && songToRehearse.relativeEnd < songsWithPeriod[i + 1]?.relativeStart)}
			<TimelineBlock
				relativeWidth={songsToRehearse.length === i + 1
					? ((roomTotalMinutes - songToRehearse.relativeEnd) * 100) / totalMinutes
					: ((songsWithPeriod[i + 1]?.relativeStart - songToRehearse.relativeEnd) * 100) /
					  totalMinutes}
			/>
		{/if}
	{/each}
	<!-- If the room closes before the rehearsal ends -->
	{#if roomTotalMinutes < totalMinutes}
		<TimelineBlock
			text="Room unavailable"
			relativeWidth={((totalMinutes - roomTotalMinutes - (roomStartMinutes - startMinutes)) /
				totalMinutes) *
				100}
		/>
	{/if}
</Row>

<style>
	:global(.timeline) {
		margin: 0px !important;
	}

	:global(.helper-row) {
		margin: 0px !important;
		margin-bottom: 10px !important;
	}

	:global(.helper-column) {
		padding: 0;
		padding-top: 5px;
	}
</style>
