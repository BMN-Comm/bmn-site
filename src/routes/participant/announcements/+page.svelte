<script lang="ts">
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import {
		Grid,
		Row,
		Column,
		StructuredListCell,
		StructuredListRow
	} from 'carbon-components-svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Grid>
	<Row>
		<Column><h1>Announcements</h1></Column>
	</Row>

	<ScrollableList>
		{#each data.announcements as announcement}
			<StructuredListRow>
				<StructuredListCell>
					{announcement.publishDate.toDate().toLocaleDateString()}
				</StructuredListCell>
				<StructuredListCell>
					<h2>{announcement.title}</h2>
					<span class="announcementMessage">{announcement.content}</span>
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</ScrollableList>
</Grid>

<style>
	:global(.announcementMessage) {
		white-space: pre-wrap;
	}
</style>
