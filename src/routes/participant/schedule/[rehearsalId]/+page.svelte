<script lang="ts">
	import { getTimeString } from '$lib/util/timeString'
	import type { PageData } from './$types'
	import {
		Column,
		Grid,
		Row,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'

	export let data: PageData

	const { rehearsal, songs, musicians } = data
</script>

<Grid>
	<Row padding>
		<Column><h1>Rehearsals {data.rehearsal.startTime.toDate().toDateString()}</h1></Column>
	</Row>
	<StructuredList>
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
					<StructuredListRow>
						<StructuredListCell>{song.name}</StructuredListCell>
						<StructuredListCell
							>{getTimeString(rehearsal.songsToRehearse[i].startTime)} -
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
				{/each}
			{/if}
		</StructuredListBody>
	</StructuredList>
</Grid>
