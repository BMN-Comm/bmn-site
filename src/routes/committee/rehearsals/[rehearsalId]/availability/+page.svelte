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
	import type { PageData } from './$types'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import type { availability } from '$lib/types/domain/availability'

	export let data: PageData

	const usersWithUndefinedAvailabilities = data.userAvailabilities.filter((x) => !x.availability)
	const usersWithDefinedAvailabilities = data.userAvailabilities.filter((x) => !!x.availability)
	const unavailableUsers = usersWithDefinedAvailabilities.filter((x) => !x.availability!.available).map(
		(user) => ({
			name: user.name,
			reason: user.availability!.reason ? user.availability!.reason : 'No reason given'
		})
	)
	const availableUsers = usersWithDefinedAvailabilities.filter((x) => x.availability!.available).map(
		(user) => ({
			name: user.name, 
			startTime: getStartTime(user.availability!), 
			endtime: getEndTime(user.availability!)
		})
	)

	function getStartTime(availability: availability): string {
		const startHour = availability.startTime.toDate().getHours()
		const startMinutes = availability.startTime.toDate().getMinutes()
		return startHour + ':' + ('0' + startMinutes).slice(-2)
	}
	function getEndTime(availability: availability): string {
		const endHour = availability.endTime.toDate().getHours()
		const endMinutes = availability.endTime.toDate().getMinutes()
		return endHour + ':' + ('0' + endMinutes).slice(-2)
	}
</script>

<Grid>
	<Row padding>
		<Column><h1>Participant availability</h1></Column>
	</Row>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Participant</StructuredListCell>
				<StructuredListCell head>Availability</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#each usersWithUndefinedAvailabilities as userAvailability}
			<StructuredListRow>
				<StructuredListCell class='orange-text'>{userAvailability.name}</StructuredListCell>
				<StructuredListCell>Availability not given</StructuredListCell>
			</StructuredListRow>
			{/each}
			{#each unavailableUsers as userAvailability}
			<StructuredListRow>
				<StructuredListCell class='red-text'>{userAvailability.name}</StructuredListCell>
				<StructuredListCell>{`Unavailable: ${userAvailability.reason}`}</StructuredListCell>
			</StructuredListRow>
			{/each}
			{#each availableUsers as userAvailability}
			<StructuredListRow>
				<StructuredListCell class='green-text'>{userAvailability.name}</StructuredListCell>
				<StructuredListCell>{userAvailability.startTime + ' - ' + userAvailability.endtime}</StructuredListCell>
			</StructuredListRow>
			{/each}
		</StructuredListBody>
	</ScrollableList>
</Grid>

<style>
	:global(.red-text) {
		color: #ef0612;
	}

	:global(.orange-text) {
		color: #ff9f1a;
	}

	:global(.green-text) {
		color: #4c9438;
	}
</style>