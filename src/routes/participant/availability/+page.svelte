<script lang="ts">
	import type { rehearsal } from '$lib/types/domain/rehearsal'
	import {
		Column,
		Grid,
		Row,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { CheckmarkOutline, Launch, MisuseOutline } from 'carbon-icons-svelte'

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
				<StructuredListCell head>Ingevuld</StructuredListCell>
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
						<!--TODO: Base this on filled in status-->
						<div class="checkmark"><CheckmarkOutline /></div>
						<div class="cross"><MisuseOutline /></div>
					</StructuredListCell>
					<StructuredListCell>
						<a href={`/participant/availability/${rehearsal.id}`}><Launch /></a>
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</StructuredList>
</Grid>

<style>
	.checkmark {
		color: green;
	}
	.cross {
		color: red;
	}
</style>
