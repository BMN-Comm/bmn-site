<script lang="ts">
	import type { PageData } from './$types'
	import {
		Column,
		Grid,
		Row,
		StructuredListCell,
		StructuredListRow
	} from 'carbon-components-svelte'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import SongIntersectionCell from '$lib/components/scheduling/SongIntersectionCell.svelte'
	import SongNameCell from '$lib/components/scheduling/SongNameCell.svelte'

	export let data: PageData
</script>

<Grid>
	<Row padding>
		<Column><h1 class="titleText">Scheduling</h1></Column>
	</Row>
	<Row>
		<Column>
			<p>
				Below, you can see the overlap between any two songs on the setlist. The table shows the
				musicians and bandcoaches that are playing in each song. A black cell indicates that the
				songs are the same, a red cell indicates that there is at least one musician playing in both
				songs. A green cell indicates that there are no musicians playing in both songs, so these
				songs can be scheduled at the same time.
			</p>
		</Column>
	</Row>

	{#if data.songs.length === 0}
		<Row padding>
			<Column>
				<p>The setlist is still empty. <a href="/committee/setlist">Add some songs!</a></p>
			</Column>
		</Row>
	{:else}
		<ScrollableList condensed>
			<StructuredListRow>
				<StructuredListCell />
				{#each data.songs as columnSong}
					<SongNameCell positionClass="top-cell" song={columnSong.name} />
				{/each}
			</StructuredListRow>
			{#each data.songs as columnSong, i}
				{@const columnMusicians = data.musiciansForSongs[columnSong.id]}
				<StructuredListRow>
					<SongNameCell positionClass="left-cell" song={columnSong.name} />
					{#each data.songs as rowSong, j}
						{@const rowMusicians = data.musiciansForSongs[rowSong.id]}
						<SongIntersectionCell
							rowIndex={i}
							columnIndex={j}
							columns={data.songs.length}
							song1={{ name: columnSong.name, musicians: columnMusicians }}
							song2={{ name: rowSong.name, musicians: rowMusicians }}
						/>
					{/each}
				</StructuredListRow>
			{/each}
		</ScrollableList>
	{/if}
</Grid>

<style>
	:global(.fixed-table-cell) {
		max-width: 80px !important;
		min-width: 80px !important;
		border-style: solid;
		border-color: rgb(57, 57, 57);
		padding: 4px 8px !important;
	}
</style>
