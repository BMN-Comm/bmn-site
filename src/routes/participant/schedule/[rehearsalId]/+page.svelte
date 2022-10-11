<script lang="ts">
	import type { rehearsalSong } from "$lib/types/domain/rehearsal"
	import type { song } from "$lib/types/domain/song"
	import { Column, Grid, Row, StructuredList, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow, TooltipDefinition } from "carbon-components-svelte"
	import { SortAscending } from "carbon-icons-svelte"
	import { get } from "svelte/store"


	export let data: { rehearsalId: string, rehearsalSongs: rehearsalSong[], songs: song[], musicians: Map<string, [string, string][]> }
</script>

<Grid>
	<Row padding>
		<Column><h1>Repetities {data.rehearsalSongs[0].startTime.toDate().toDateString()}</h1></Column>
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
					<StructuredListCell>{data.rehearsalSongs[i].startTime.toDate().getHours()}:{String(
										 data.rehearsalSongs[i].startTime.toDate().getMinutes()).padStart(2, '0')} - 
										{data.rehearsalSongs[i].endTime.toDate().getHours()}:{String(
										 data.rehearsalSongs[i].endTime.toDate().getMinutes()).padStart(2, '0')}
					</StructuredListCell>
					<StructuredListCell>
						{#each [...data.musicians] as [key, value]}
							{#if key == song.id}
								{#each value as musician}
									{musician[0]} - {musician[1]}<br>
								{/each}
							{/if}
						{/each}
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</StructuredList>
</Grid>