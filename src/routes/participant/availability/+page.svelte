<script lang="ts">
	import type { rehearsal } from '$lib/types/domain/rehearsal'
	import type { availability } from '$lib/types/domain/availability'
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
	import { getTimeString } from '$lib/util/timeString'

	export let data: { rehearsals: rehearsal[]; availability: availability[] }

	let rehearsalAvailability = Object.assign(
		{},
		...data.availability.map((x) => ({ [x.rehearsal.id]: x.available }))
	)
</script>

<Grid>
	<Row padding>
		<Column><h1>Planned rehearsals</h1></Column>
	</Row>
	<StructuredList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Date</StructuredListCell>
				<StructuredListCell head>Time</StructuredListCell>
				<StructuredListCell head>Location</StructuredListCell>
				<StructuredListCell head>Submitted</StructuredListCell>
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
						{#if rehearsal.id in rehearsalAvailability}
							<div class="checkmark"><CheckmarkOutline /></div>
						{:else}
							<div class="cross"><MisuseOutline /></div>
						{/if}
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
