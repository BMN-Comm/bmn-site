<script lang="ts">
	import { getTimeString } from '$lib/util/timeString'
	import type { PageData } from './$types'
	import {
		Button,
		Grid,
		Modal,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { Chat } from 'carbon-icons-svelte'
	import ScrollableList from '$lib/components/scrollableList.svelte'

	export let data: PageData

	let reasonText: string = ''
	let openReason: boolean = false
</script>

<h1>Rehearsals {data.rehearsal.startTime.toDate().toDateString()}</h1>
<Grid>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Participant</StructuredListCell>
				<StructuredListCell head>Availability</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each data.users as user}
			<StructuredListRow>
				<StructuredListCell>
					{user.name}
				</StructuredListCell>
				<StructuredListCell>
					{#if user.id in data.availabilities}
						{@const availability = data.availabilities[user.id]}
						{#if availability.available}
							{getTimeString(availability.startTime)} -
							{getTimeString(availability.endTime)}
						{:else}
							Unavailable
						{/if}
						{#if availability.reason !== undefined && availability.reason.length > 1}
							<Button
								kind="ghost"
								size="small"
								iconDescription="Remarks"
								icon={Chat}
								on:click={() => {
									reasonText = availability.reason ?? ''
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
	</ScrollableList>
</Grid>

<Modal passiveModal modalHeading="Reason" bind:open={openReason}>
	<p>{reasonText}</p>
</Modal>
