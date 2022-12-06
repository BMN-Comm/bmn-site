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
	import { CheckmarkOutline, Launch, MisuseOutline } from 'carbon-icons-svelte'
	import { getTimeString } from '$lib/util/timeString'
	import type { PageData } from './$types'
	import ScrollableList from '$lib/components/scrollableList.svelte'

	export let data: PageData
</script>

<Grid>
	<Row padding>
		<Column><h1>Your availability</h1></Column>
	</Row>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Date</StructuredListCell>
				<StructuredListCell head>Time</StructuredListCell>
				<StructuredListCell head>Location</StructuredListCell>
				<StructuredListCell head>Submitted</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#each data.rehearsals as rehearsal}
				<StructuredListRow>
					<a href={`/participant/availability/${rehearsal.id}`}>
						<StructuredListCell>
							<div class="rehearsalLinkText">{rehearsal.startTime.toDate().toDateString()}</div>
						</StructuredListCell>
					</a>
					<StructuredListCell>
						{getTimeString(rehearsal.startTime)} -
						{getTimeString(rehearsal.endTime)}
					</StructuredListCell>
					<StructuredListCell>
						{rehearsal.location}
					</StructuredListCell>
					<StructuredListCell>
						{#if data.availability[rehearsal.id] !== undefined}
							<CheckmarkOutline class="checkmark" />
						{:else}
							<MisuseOutline class="cross" />
						{/if}
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</ScrollableList>
</Grid>

<style>
	:global(.checkmark) {
		color: green;
	}
	:global(.cross) {
		color: red;
	}
</style>
