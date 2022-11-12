<script lang="ts">
	import {
		Grid,
		Row,
		Column,
		StructuredList,
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

	<StructuredList>
		{#each data.announcements as announcement}
			<StructuredListRow>
				<StructuredListCell>
					{announcement.publishDate.toDate().toLocaleDateString()}
				</StructuredListCell>
				<StructuredListCell>
					<h2>{announcement.title}</h2>
					<span>{announcement.content}</span>
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</StructuredList>
</Grid>
