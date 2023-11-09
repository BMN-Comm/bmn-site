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

<Grid class="with-overflow">
	<Row>
		<Column><h1 class="titleText">Scheduling</h1></Column>
	</Row>

	<ScrollableList condensed>
		<StructuredListRow>
			<StructuredListCell />
			{#each data.songs as song}
				<SongNameCell positionClass="top-cell" song={song.name} />
			{/each}
		</StructuredListRow>
		{#each data.songs as song1, i}
			{@const musicians1 = data.musiciansForSongs[song1.id]}
			<StructuredListRow>
				<SongNameCell positionClass="left-cell" song={song1.name} />
				{#each data.songs as song2, j}
					{@const musicians2 = data.musiciansForSongs[song2.id]}
					<SongIntersectionCell
						position={[i, j]}
						columns={data.songs.length}
						songs={[song1.name, song2.name]}
						musicians={[musicians1, musicians2]}
					/>
				{/each}
			</StructuredListRow>
		{/each}
	</ScrollableList>
</Grid>

<style>
	:global(.fixed-table-cell) {
		max-width: 80px !important;
		min-width: 80px !important;
		border-style: solid;
		border-color: rgb(57, 57, 57);
		padding: 4px 8px !important;
	}

	:global(.with-overflow) {
		overflow: visible !important;
	}
</style>
