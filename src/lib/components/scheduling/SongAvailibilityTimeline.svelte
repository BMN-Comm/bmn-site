<script lang="ts">
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import type { availability } from '$lib/types/domain/availability'
	import type { Musician } from '$lib/types/domain/musician'
	import type { song } from '$lib/types/domain/song'
	import { getTimeString } from '$lib/util/timeString'
	import {
		Column,
		Row,
		StructuredListBody,
		StructuredListCell,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { ChevronDown, ChevronUp } from 'carbon-icons-svelte'

	export let startTime: Date
	export let endTime: Date

	export let song: song

	export let musicians: Musician[]

	export let musicianAvailabilities: {
		[x: string]: availability | undefined
	}

	const startMinutes = startTime.getHours() * 60 + startTime.getMinutes()
	const totalMinutes = endTime.getHours() * 60 + endTime.getMinutes() - startMinutes

	// The minimum time to start is the maximum of all available start times
	const minStartTime = Math.max(
		...musicians.map((musician) => {
			const musicianAvailable = musicianAvailabilities[musician.participantId]
			if (!musicianAvailable || !musicianAvailable.available) return 0
			const dateTime = musicianAvailable.startTime.toDate()
			return dateTime.getHours() * 60 + dateTime.getMinutes() - startMinutes
		})
	)
	// The maximum time to end is the minimum of all available end times
	const maxEndTime = Math.min(
		...musicians.map((musician) => {
			const musicianAvailable = musicianAvailabilities[musician.participantId]
			if (!musicianAvailable || !musicianAvailable.available) return totalMinutes
			const dateTime = musicianAvailable.endTime.toDate()
			return dateTime.getHours() * 60 + dateTime.getMinutes() - startMinutes
		})
	)

	// Help vars, see if the slot is possible, everybody is available, and if there is somebody that did not fill in availability (SHAME)
	const somebodyUnavailable = musicians.some(
		(x) =>
			musicianAvailabilities[x.participantId] && !musicianAvailabilities[x.participantId]!.available
	)
	const somebodyNotGiven = musicians.some((x) => !musicianAvailabilities[x.participantId])
	const timeslotPossible = minStartTime < maxEndTime

	let showParticipants = false
</script>

<Row class="song-timeline">
	<div class="timeline-title">
		{song.name}
		{#if somebodyNotGiven}*{/if}
	</div>
	<div
		class="dropdown-icon"
		on:click={() => {
			showParticipants = !showParticipants
		}}
		on:keydown={() => {
			showParticipants = !showParticipants
		}}
	>
		{#if showParticipants}
			<ChevronUp />
		{:else}
			<ChevronDown />
		{/if}
	</div>

	{#if timeslotPossible}
		{#if minStartTime > 0}
			<Column
				class="red"
				style={`max-width: ${(minStartTime / totalMinutes) * 100}% !important;`}
			/>
		{/if}
		<Column
			class={somebodyUnavailable ? "orange" : "green"}
			style={`max-width: ${((maxEndTime - minStartTime) / totalMinutes) * 100}%;`}
		/>
		{#if maxEndTime < totalMinutes}
			<Column
				class="red"
				style={`max-width: ${((totalMinutes - maxEndTime) / totalMinutes) * 100}% !important;`}
			/>
		{/if}
	{:else}
		<Column class="no-interval">No available overlap</Column>
	{/if}
</Row>
{#if showParticipants}
	<ScrollableList condensed classname="availability-list">
		<StructuredListBody>
			{#each musicians as musician}
				{@const availability = musicianAvailabilities[musician.participantId]}
				<StructuredListRow>
					<StructuredListCell>{musician.participantName}</StructuredListCell>
					<StructuredListCell>
						{musician.instrumentName}<br />
					</StructuredListCell>
					<StructuredListCell>
						{#if availability}
							{#if availability.available}
								{getTimeString(availability.startTime)} -
								{getTimeString(availability.endTime)}
							{:else}
								{#if availability.reason}
									Unavailable: <br />
									{availability.reason}
								{:else}
									Unavailable
								{/if}
							{/if}
						{:else}
							Availablity not given
						{/if}
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</ScrollableList>
{/if}

<style>
	:global(.song-timeline) {
		height: 50px;
		width: 100%;
		position: relative;
		margin: 0px;
		margin-bottom: 5px;
	}

	.timeline-title {
		position: absolute;
		left: 5px;
		top: 5px;
	}

	:global(.somebody-unavailable),
	:global(.no-interval) {
		background-color: #ef0612;
		text-align: center;
		padding-top: 15px;
	}

	:global(.red) {
		background-color: #ef0612;
	}

	:global(.orange) {
		background-color: #ff9f1a;
	}

	:global(.green) {
		background-color: #4c9438;
	}

	:global(.dropdown-icon) {
		position: absolute;
		right: 5px;
		top: 15px;
		cursor: pointer;
	}

	:global(.availability-list) {
		margin-bottom: 5px;
	}
</style>
