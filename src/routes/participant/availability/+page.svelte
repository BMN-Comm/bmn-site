<script lang="ts">
	import {
		Button,
		Column,
		Grid,
		Row,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { CheckmarkOutline, MisuseOutline } from 'carbon-icons-svelte'
	import { getTimeString } from '$lib/util/timeString'
	import type { PageData } from './$types'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import type { Rehearsal } from '$lib/types/domain/rehearsal'
	import SetAvailabilityModal from '$lib/components/availability/SetAvailabilityModal.svelte'
	import type { Availability } from '$lib/types/domain/availability'

	export let data: PageData

	let selectedRehearsal: Rehearsal | undefined = undefined
	let selectedAvailability: Availability | undefined = undefined
	let openSetAvailability = false
</script>

<Grid>
	<Row padding>
		<Column><h1>Your availability</h1></Column>
	</Row>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head />
				<StructuredListCell head>Date</StructuredListCell>
				<StructuredListCell head>Location</StructuredListCell>
				<StructuredListCell head>Rehearsal time</StructuredListCell>
				<StructuredListCell head>Availability</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#each data.rehearsals as rehearsal}
				<!-- undefined when the availability is not yet filled in for this rehearsal -->
				{@const availability = data.availabilities[rehearsal.id]}

				<StructuredListRow>
					<StructuredListCell>
						{#if availability}
							<CheckmarkOutline class="checkmark" />
						{:else}
							<MisuseOutline class="cross" />
						{/if}
					</StructuredListCell>
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
						{#if availability}
							{#if !availability.available}
								Unavailable
							{:else}
								{getTimeString(availability.startTime)} -
								{getTimeString(availability.endTime)}
							{/if}
						{/if}
					</StructuredListCell>
					<StructuredListCell>
						<Button
							kind="ghost"
							size="small"
							on:click={() => {
								selectedRehearsal = rehearsal
								selectedAvailability = availability
								openSetAvailability = true
							}}
						>
							{availability ? 'Update availability' : 'Set availability'}
						</Button>
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</ScrollableList>
</Grid>

{#if selectedRehearsal && data.user}
	<SetAvailabilityModal
		bind:openSetAvailability
		rehearsal={selectedRehearsal}
		availability={selectedAvailability}
		user={{ id: data.user.databaseId, name: data.user.name }}
		onClose={() => {
			selectedRehearsal = undefined
			selectedAvailability = undefined
		}}
	/>
{/if}

<style>
	:global(.checkmark) {
		color: green;
	}
	:global(.cross) {
		color: red;
	}
</style>
