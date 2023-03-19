<script lang="ts">
	import { getTimeString } from '$lib/util/timeString'
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import {
		Checkbox,
		Column,
		Grid,
		Row,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import ScrollableList from '$lib/components/scrollableList.svelte'

	export let data: PageData

	let filterOwnSongs = false

	const { rehearsal, songs, musicians } = data
	songs.sort(
		(song1, song2) =>
			rehearsal.songsToRehearse.find((rehearsalSong) => rehearsalSong.song.id === song1.id)!
				.startTime.seconds -
			rehearsal.songsToRehearse.find((rehearsalSong) => rehearsalSong.song.id === song2.id)!
				.startTime.seconds
	)

	rehearsal.songsToRehearse.sort((song, song2) => song.startTime.seconds - song2.startTime.seconds)
</script>

<Grid>
	<Row padding>
		<Column>
			<h1>Rehearsals {data.rehearsal.startTime.toDate().toDateString()}</h1>
			<Checkbox
				labelText="Show only my songs"
				on:change={() => {
					filterOwnSongs = !filterOwnSongs
				}}
			/>
		</Column>
	</Row>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Time</StructuredListCell>
				<StructuredListCell head>Line-up</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#if songs != undefined}
				{#each songs as song, i}
					{#if !filterOwnSongs || musicians[song.id].some((m) => m.participantId === $page.data.user?.databaseId)}
						<StructuredListRow>
							<StructuredListCell>{song.name}</StructuredListCell>
							<StructuredListCell>
								{getTimeString(rehearsal.songsToRehearse[i].startTime)} -
								{getTimeString(rehearsal.songsToRehearse[i].endTime)}
							</StructuredListCell>
							<StructuredListCell>
								{@const musiciansForSong = musicians[song.id]}
								{#if musicians !== undefined}
									{#each musiciansForSong as musician}
										{musician.participantName} - {musician.instrumentName}<br />
									{/each}
								{/if}
							</StructuredListCell>
						</StructuredListRow>
					{/if}
				{/each}
			{/if}
		</StructuredListBody>
	</ScrollableList>
</Grid>
