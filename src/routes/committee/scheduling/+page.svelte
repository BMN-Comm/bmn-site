<script lang="ts">
	import type { PageData } from './$types'
	import {
		Column,
		Grid,
		Row,
		StructuredList,
		StructuredListCell,
		StructuredListRow
	} from 'carbon-components-svelte'
	import SongIntersectionCell from '$lib/components/scheduling/SongIntersectionCell.svelte'
	import SongNameCell from '$lib/components/scheduling/SongNameCell.svelte'
	import CellColorLegend from '$lib/components/scheduling/CellColorLegend.svelte'

	export let data: PageData
</script>

<Grid>
	<Row>
		<Column><h1 class="titleText">Scheduling</h1></Column>
	</Row>
	<Row padding>
		<Column>
			<p>
				Below, you can see the overlap between any two songs on the setlist. The table shows the
				musicians and bandcoaches that are playing in each song. Below the table, you can find a
				legend.
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
		<StructuredList class="list-without-bottom-margin">
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
		</StructuredList>

		<CellColorLegend />
	{/if}
</Grid>

<style>
	:global(.list-without-bottom-margin) {
		margin-bottom: 0;
	}

	:global(.fixed-table-cell) {
		max-width: 80px !important;
		min-width: 80px !important;
		border-style: solid;
		border-color: rgb(57, 57, 57);
		padding: 4px 8px !important;
	}
</style>
