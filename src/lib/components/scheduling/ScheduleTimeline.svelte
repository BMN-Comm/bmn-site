<script lang="ts">
	import TimelineBlock from '$lib/components/scheduling/TimelineBlock.svelte'
	import type { rehearsalSong } from '$lib/types/domain/rehearsal'
	import type { song } from '$lib/types/domain/song'
	import { Column, Row } from 'carbon-components-svelte'

	export let startTime: Date
	export let endTime: Date

	export let songsToRehearse: rehearsalSong[]
	export let songs: song[]

	export let deleteSong: (songToDelete: string) => void

	const startMinutes = startTime.getHours() * 60 + startTime.getMinutes()
	const totalMinutes = endTime.getHours() * 60 + endTime.getMinutes() - startMinutes

	// Create an array with the time intervals where we want to show time indications
	const helperIntervals = Array.from(Array(Math.floor(totalMinutes / 30))).map(
		(_, i) => new Date(startTime.getTime() + i * 30 * 60 * 1000)
	)

	// Create a list of songs along with range when it is planned, sorted by starting time
	const songsWithPeriod = songsToRehearse
		.map((song) => {
			const songStartDate = song.startTime.toDate()
			const songEndDate = song.endTime.toDate()
			const relativeStart =
				songStartDate.getHours() * 60 + songStartDate.getMinutes() - startMinutes
			const relativeEnd = songEndDate.getHours() * 60 + songEndDate.getMinutes() - startMinutes
			return {
				rehearsalSongId: song.id,
				relativeStart,
				relativeEnd,
				songId: song.song.id,
				length: relativeEnd - relativeStart
			}
		})
		// For some reason js sorted incorrectly when using min, so I'm using this approachs
		.sort((x, y) => Math.max(x.relativeStart, y.relativeStart))
		.reverse()
</script>

<!-- Helper row for indicating time -->
<Row class="helper-row">
	{#each helperIntervals as interval}
		<Column class="helper-column">
			<p class="vertical-text">
				{interval.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
			</p>
		</Column>
	{/each}
</Row>
<!-- Row for songs that will be played -->
<Row class="timeline">
	<!-- If there is free space at the beginning, or no songs at all, fill up the space -->
	{#if songsWithPeriod.length === 0 || songsWithPeriod[0].relativeStart > 0}
		<TimelineBlock
			relativeWidth={songsWithPeriod.length === 0 ? totalMinutes : songsWithPeriod[0].relativeStart}
		/>
	{/if}
	{#each songsWithPeriod as songToRehearse, i}
		<!-- Render each song in the timeline -->
		<TimelineBlock
			relativeWidth={(songToRehearse.length * 100) / totalMinutes}
			song={songs.find((x) => x.id == songToRehearse.songId)}
			deleteSong={() => deleteSong(songToRehearse.rehearsalSongId)}
		/>
		{@const a = console.log(songToRehearse.relativeEnd, songsWithPeriod[i + 1]?.relativeStart)}
		{#if (songsToRehearse.length === i + 1 && songToRehearse.relativeEnd < totalMinutes) || (songsToRehearse.length > i + 1 && songToRehearse.relativeEnd < songsWithPeriod[i + 1]?.relativeStart)}
			<TimelineBlock
				relativeWidth={songsWithPeriod.length === 0
					? totalMinutes
					: (songsWithPeriod[i].length * 100) / totalMinutes}
			/>
		{/if}
	{/each}
</Row>

<style>
	.vertical-text {
		writing-mode: vertical-rl;
		text-orientation: mixed;
		margin-left: -10px;
	}

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
