<script lang="ts">
	import {
		Column,
		ExpandableTile,
		Grid,
		Row,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import type { rehearsal } from '$lib/types/domain/rehearsal'
	import { Launch } from 'carbon-icons-svelte'

	export let data: { rehearsals: rehearsal[] }
</script>

<Grid>
	<Row padding>
		<Column><h1>Geplande Repetities</h1></Column>
	</Row>
	<StructuredList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Datum</StructuredListCell>
				<StructuredListCell head>Tijd</StructuredListCell>
				<StructuredListCell head>Locatie</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#each data.rehearsals as rehearsal, i}
				<StructuredListRow>
					<StructuredListCell>
						{rehearsal.startTime.toDate().toDateString()}
					</StructuredListCell>
					<StructuredListCell>
						{rehearsal.startTime.toDate().getHours()}:{String(
							rehearsal.startTime.toDate().getMinutes()
						).padStart(2, '0')} -
						{rehearsal.endTime.toDate().getHours()}:{String(
							rehearsal.endTime.toDate().getMinutes()
						).padStart(2, '0')}
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
	</StructuredList>
</Grid>
