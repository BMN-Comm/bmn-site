<script lang="ts">
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import type { song } from '$lib/types/domain/song'
	import {
		Column,
		Grid,
		Row,
		StructuredList,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'

	export let data: {
		songs: song[]
		musiciansForSongs: {
			[songId: string]: { participantName: string; instrumentName: string }[]
		}
	}
</script>

<Grid>
	<Row>
		<Column><h1 class="titleText">Setlist</h1></Column>
	</Row>

	<StructuredList condensed>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Artist</StructuredListCell>
				<StructuredListCell head>Link</StructuredListCell>
				<StructuredListCell head>Line-up</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each data.songs as song}
			<StructuredListRow>
				<StructuredListCell>{song.name}</StructuredListCell>
				<StructuredListCell>{song.artist}</StructuredListCell>
				<StructuredListCell>
					<PlayLinkButton url={song.link} />
				</StructuredListCell>
				<StructuredListCell>
					{@const musicians = data.musiciansForSongs[song.id]}
					{#if musicians !== undefined}
						{#each musicians as musician, j}
							{musician.participantName} - {musician.instrumentName}<br />
						{/each}
					{/if}
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</StructuredList>
</Grid>
