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
	import type { PageData } from './$types'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import type { Availability } from '$lib/types/domain/availability'
	import type { Rehearsal } from '$lib/types/domain/rehearsal'
	import SetAvailabilityModal from '$lib/components/availability/SetAvailabilityModal.svelte'

	export let data: PageData

	let selectedRehearsal: Rehearsal | undefined = undefined
	let selectedAvailability: Availability | undefined = undefined
	let selectedUser: { id: string; name: string } | undefined = undefined
	let openSetAvailability = false

	// These need to be explicitly reactive because svelte doesn't track changes in nested properties
	$: usersWithUndefinedAvailabilities = data.userAvailabilities.filter((user) => !user.availability)
	$: usersWithDefinedAvailabilities = data.userAvailabilities
		.filter((user) => !!user.availability)
		.map((user) => ({
			...user,
			availability: user.availability!
		}))
	$: unavailableUsers = usersWithDefinedAvailabilities.filter(
		(user) => !user.availability!.available
	)
	$: availableUsers = usersWithDefinedAvailabilities.filter((user) => user.availability!.available)

	function getStartTime(availability: Availability): string {
		const startHour = availability.startTime.toDate().getHours()
		const startMinutes = availability.startTime.toDate().getMinutes()
		return startHour + ':' + ('0' + startMinutes).slice(-2)
	}
	function getEndTime(availability: Availability): string {
		const endHour = availability.endTime.toDate().getHours()
		const endMinutes = availability.endTime.toDate().getMinutes()
		return endHour + ':' + ('0' + endMinutes).slice(-2)
	}
	function getAvailabilityString(availability: Availability): string {
		return getStartTime(availability) + ' - ' + getEndTime(availability)
	}
</script>

<Grid>
	<Row>
		<Column><h1>Participant availability</h1></Column>
	</Row>
	<Row class="row-with-bottom-padding">
		<Column>
			<p>
				Here you can see the availability of all participants for the rehearsal on{' '}
				{data.rehearsal.startTime.toDate().toDateString()}.
			</p>
		</Column>
	</Row>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Participant</StructuredListCell>
				<StructuredListCell head>Availability</StructuredListCell>
				<StructuredListCell head />
			</StructuredListRow>
		</StructuredListHead>

		<!-- The list is split into three categories. Users that have not submitted their availability yet, unavailable and lastly available users. -->
		<StructuredListBody>
			<!-- Users that have not submitted their availability yet -->
			{#each usersWithUndefinedAvailabilities as userAvailability}
				<StructuredListRow>
					<StructuredListCell class="orange-text">
						{userAvailability.user.name}
					</StructuredListCell>
					<StructuredListCell>Availability not given</StructuredListCell>
					<StructuredListCell>
						<Button
							kind="ghost"
							size="small"
							on:click={() => {
								selectedRehearsal = data.rehearsal
								selectedAvailability = undefined
								selectedUser = userAvailability.user
								openSetAvailability = true
							}}
						>
							Set availability
						</Button>
					</StructuredListCell>
				</StructuredListRow>
			{/each}

			<!-- Users that are unavailable -->
			{#each unavailableUsers as userAvailability}
				<StructuredListRow>
					<StructuredListCell class="red-text">
						{userAvailability.user.name}
					</StructuredListCell>
					<StructuredListCell>
						{`Unavailable: ${userAvailability.availability.reason || 'No reason given'}`}
					</StructuredListCell>
					<StructuredListCell>
						<Button
							kind="ghost"
							size="small"
							on:click={() => {
								selectedRehearsal = data.rehearsal
								selectedAvailability = userAvailability.availability
								selectedUser = userAvailability.user
								openSetAvailability = true
							}}
						>
							Update availability
						</Button>
					</StructuredListCell>
				</StructuredListRow>
			{/each}

			<!-- Users that are available -->
			{#each availableUsers as userAvailability}
				<StructuredListRow>
					<StructuredListCell class="green-text">
						{userAvailability.user.name}
					</StructuredListCell>
					<StructuredListCell>
						{getAvailabilityString(userAvailability.availability)}
					</StructuredListCell>
					<StructuredListCell>
						<Button
							kind="ghost"
							size="small"
							on:click={() => {
								selectedRehearsal = data.rehearsal
								selectedAvailability = userAvailability.availability
								selectedUser = userAvailability.user
								openSetAvailability = true
							}}
						>
							Update availability
						</Button>
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</ScrollableList>
</Grid>

{#if selectedRehearsal && selectedUser}
	<SetAvailabilityModal
		bind:openSetAvailability
		rehearsal={selectedRehearsal}
		availability={selectedAvailability}
		user={selectedUser}
		displayUserName
		onClose={() => {
			selectedRehearsal = undefined
			selectedAvailability = undefined
			selectedUser = undefined
		}}
	/>
{/if}

<style>
	:global(.red-text) {
		color: #ef0612 !important;
	}

	:global(.orange-text) {
		color: #ff9f1a !important;
	}

	:global(.green-text) {
		color: #4c9438 !important;
	}

	:global(.row-with-bottom-padding) {
		padding-bottom: 1rem;
	}
</style>
