<script lang="ts">
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import {
		Checkbox,
		Column,
		Grid,
		Row,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import ScrollableList from '$lib/components/scrollableList.svelte'

	export let data: PageData

	let filterOwnSongs = false
</script>

<Grid>
	<Row>
		<Column>
			<h1 class="titleText">Setlist</h1>
			<Checkbox
				labelText="Show only my songs"
				on:change={() => {
					filterOwnSongs = !filterOwnSongs
				}}
			/>
		</Column>
	</Row>

	<ScrollableList condensed>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Artist</StructuredListCell>
				<StructuredListCell head>Genre</StructuredListCell>
				<StructuredListCell head>Length</StructuredListCell>
				<StructuredListCell head>Link</StructuredListCell>
				<StructuredListCell head>Line-up</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each data.songs as song}
			{@const musicians = data.musiciansForSongs[song.id]}
			{#if !filterOwnSongs || musicians.some((m) => m.participantId === $page.data.user?.databaseId)}
				<StructuredListRow>
					<StructuredListCell>{song.name}</StructuredListCell>
					<StructuredListCell>{song.artist}</StructuredListCell>
					<StructuredListCell>{song.genre}</StructuredListCell>
					<StructuredListCell>{song.length}</StructuredListCell>
					<StructuredListCell>
						<PlayLinkButton url={song.link} />
					</StructuredListCell>
					<StructuredListCell>
						{#if musicians !== undefined}
							{#each musicians as musician}
								{musician.participantName} - {musician.instrumentName}<br />
							{/each}
						{/if}
					</StructuredListCell>
				</StructuredListRow>
			{/if}
		{/each}
	</ScrollableList>
</Grid>
