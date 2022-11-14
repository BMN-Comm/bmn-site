<script lang="ts">
	import {
		Column,
		Grid,
		Row,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { Launch } from 'carbon-icons-svelte'
	import { getTimeString } from '$lib/util/timeString'
	import type { PageData } from './$types'
	import ScrollableList from '$lib/components/scrollableList.svelte'

	export let data: PageData
</script>

<Grid>
	<Row padding>
		<Column><h1>Planned rehearsals</h1></Column>
	</Row>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Date</StructuredListCell>
				<StructuredListCell head>Time</StructuredListCell>
				<StructuredListCell head>Location</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#each data.rehearsals as rehearsal, i}
				<StructuredListRow>
					<StructuredListCell>
						{rehearsal.startTime.toDate().toDateString()}
					</StructuredListCell>
					<StructuredListCell>
						{getTimeString(rehearsal.startTime)} -
						{getTimeString(rehearsal.endTime)}
					</StructuredListCell>
					<StructuredListCell>
						{rehearsal.location}
					</StructuredListCell>
					<StructuredListCell>
						<a href={`/participant/schedule/${rehearsal.id}`}><Launch /></a>
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</ScrollableList>
</Grid>
