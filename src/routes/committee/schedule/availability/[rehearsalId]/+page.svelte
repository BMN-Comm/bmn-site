<script lang="ts">
	import type { newAvailability } from '$lib/types/domain/availability'
	import type { rehearsal } from '$lib/types/domain/rehearsal'
	import type { user } from '$lib/types/domain/user'
	import { getTimeString } from '$lib/util/timeString'
	import {
		Button,
		Grid,
		Modal,
		StructuredList,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { Chat } from 'carbon-icons-svelte'

	export let data: {
		users: { [id: string]: user }
		availabilities: { [id: string]: newAvailability }
		rehearsal: rehearsal
	}
	let reasonText: string = ''
	let openReason: boolean = false
</script>

<h1>Rehearsals {data.rehearsal.startTime.toDate().toDateString()}</h1>
<Grid>
	<StructuredList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Participant</StructuredListCell>
				<StructuredListCell head>Availability</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each Object.entries(data.users) as [id, user]}
			<StructuredListRow>
				<StructuredListCell>
					{user.name}
				</StructuredListCell>
				<StructuredListCell>
					{#if id in data.availabilities}
						{@const availability = data.availabilities[id]}
						{#if availability.available}
							{getTimeString(availability.startTime)} -
							{getTimeString(availability.endTime)}
						{:else}
							Unavailable
						{/if}
						{#if availability.reason !== null && availability.reason.length > 1}
							<Button
								kind="ghost"
								size="small"
								iconDescription="Remarks"
								icon={Chat}
								on:click={() => {
									reasonText = availability.reason
									openReason = true
								}}
							/>
						{/if}
					{:else}
						Not provided
					{/if}
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</StructuredList>
</Grid>

<Modal passiveModal modalHeading="Reason" bind:open={openReason}>
	<p>{reasonText}</p>
</Modal>
