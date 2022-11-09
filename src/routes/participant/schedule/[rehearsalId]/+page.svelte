<script lang="ts">
	import type { rehearsal, rehearsalSong } from '$lib/types/domain/rehearsal'
	import type { song } from '$lib/types/domain/song'
	import { getTimeString } from '$lib/util/timeString'
	import {
		Column,
		Grid,
		Row,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow,
		TooltipDefinition
	} from 'carbon-components-svelte'
	import { SortAscending } from 'carbon-icons-svelte'
	import { get } from 'svelte/store'

	export let data: {
		rehearsal: rehearsal
		rehearsalId: string
		rehearsalSongs: rehearsalSong[]
		songs: song[]
		musicians: Map<string, [string, string][]>
	}
</script>

<Grid>
	<Row padding>
		<Column><h1>Repetities {data.rehearsal.startTime.toDate().toDateString()}</h1></Column>
	</Row>
	<StructuredList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Titel</StructuredListCell>
				<StructuredListCell head>Tijd</StructuredListCell>
				<StructuredListCell head>Bezetting</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#each data.songs as song, i}
				<StructuredListRow>
					<StructuredListCell>{song.name}</StructuredListCell>
					<StructuredListCell
						>{getTimeString(data.rehearsalSongs[i].startTime)} -
						{getTimeString(data.rehearsalSongs[i].endTime)}
					</StructuredListCell>
					<StructuredListCell>
						{#each Object.entries(data.musicians) as [key, value]}
							{#if key == song.id}
								{#each value as musician}
									{musician[0]} - {musician[1]}<br />
								{/each}
							{/if}
						{/each}
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</StructuredList>
</Grid>
