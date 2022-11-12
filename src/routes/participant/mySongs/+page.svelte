<script lang="ts">
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
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	export let data: PageData

	const { songs, musiciansForSongs } = data
</script>

<Grid>
	<Row padding>
		<Column><h1>My Songs</h1></Column>
	</Row>
	<StructuredList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Artist</StructuredListCell>
				<StructuredListCell head>Link</StructuredListCell>
				<StructuredListCell head>Line-up</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#if songs != undefined}
				{#each songs as song, i}
					<StructuredListRow>
						<StructuredListCell>
							{song.name}
						</StructuredListCell>
						<StructuredListCell>
							{song.artist}
						</StructuredListCell>
						<StructuredListCell>
							<PlayLinkButton url={song.link} />
						</StructuredListCell>
						<StructuredListCell>
							{@const musiciansForSong = musiciansForSongs[song.id]}
							{#if musiciansForSongs !== undefined}
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
