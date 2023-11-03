<script lang="ts">
	import { page } from '$app/stores'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import type { rehearsalSong } from '$lib/types/domain/rehearsal'
	import type { Song } from '$lib/types/domain/song'
	import { getTimeString } from '$lib/util/timeString'
	import {
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'

	export let songsToRehearse: rehearsalSong[]
	export let songs: { [x: string]: Song }
	export let musicians: {
		[songId: string]: {
			participantName: string
			instrumentName: string
			participantId: string
		}[]
	}

	export let filterOwnSongs: boolean
</script>

<ScrollableList>
	<StructuredListHead>
		<StructuredListRow head>
			<StructuredListCell head>Title</StructuredListCell>
			<StructuredListCell head>Time</StructuredListCell>
			<StructuredListCell head>Line-up</StructuredListCell>
		</StructuredListRow>
	</StructuredListHead>
	<StructuredListBody>
		{#each songsToRehearse as songToRehearse}
			{@const songId = songToRehearse.song.id}
			{@const song = songs[songId]}
			{#if !filterOwnSongs || musicians[songId].some((m) => m.participantId === $page.data.user?.databaseId)}
				<StructuredListRow>
					<StructuredListCell>{song.name}</StructuredListCell>
					<StructuredListCell>
						{getTimeString(songToRehearse.startTime)} -
						{getTimeString(songToRehearse.endTime)}
					</StructuredListCell>
					<StructuredListCell>
						{@const musiciansForSong = musicians[songId]}
						{#if musiciansForSong !== undefined}
							{#each musiciansForSong as musician}
								{musician.participantName} - {musician.instrumentName}<br />
							{/each}
						{/if}
					</StructuredListCell>
				</StructuredListRow>
			{/if}
		{/each}
	</StructuredListBody>
</ScrollableList>
