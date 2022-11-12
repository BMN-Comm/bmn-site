<script lang="ts">
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import {
		Checkbox,
		Column,
		Grid,
		Row,
		StructuredList,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'

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
			{@const musicians = data.musiciansForSongs[song.id]}
			{#if (filterOwnSongs && musicians
					.map((musician) => {
						return musician.participantId == $page.data.user?.databaseId
					})
					.includes(true)) || !filterOwnSongs}
				<StructuredListRow>
					<StructuredListCell>{song.name}</StructuredListCell>
					<StructuredListCell>{song.artist}</StructuredListCell>
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
	</StructuredList>
</Grid>
