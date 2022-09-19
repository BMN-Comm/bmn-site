<script lang="ts">
	import {
		Grid,
		Row,
		Column,
		StructuredList,
		StructuredListHead,
		StructuredListCell,
		StructuredListBody,
		StructuredListRow
	} from 'carbon-components-svelte'
	import type { announcement } from '$lib/types/domain/announcement'

	export let data: { announcements: announcement[] }

	console.log(data)
</script>

<Grid>
	<Row>
		<Column><h1>Mededelingen</h1></Column>
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
