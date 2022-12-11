<script lang="ts">
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import type { availability } from '$lib/types/domain/availability'
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

	export let musicians: {
		participantId: string
		participantName: string
		instrumentName: string
	}[]

	export let musicianAvailabilities:
		| {
				[x: string]: availability | undefined
		  }
		| undefined

	// Ugly, I know, might fix later
	const nonNullMusicianAvailabilities = musicianAvailabilities!

	const startMinutes = startTime.getHours() * 60 + startTime.getMinutes()
	const totalMinutes = endTime.getHours() * 60 + endTime.getMinutes() - startMinutes

	const minStartTime = Math.max(
		...musicians.map((musician) => {
			const musicianAvailable = nonNullMusicianAvailabilities[musician.participantId]
			if (!musicianAvailable || !musicianAvailable.available) return 0
			const dateTime = musicianAvailable.startTime.toDate()
			return dateTime.getHours() * 60 + dateTime.getMinutes() - startMinutes
		})
	)
	const maxEndTime = Math.min(
		...musicians.map((musician) => {
			const musicianAvailable = nonNullMusicianAvailabilities[musician.participantId]
			if (!musicianAvailable || !musicianAvailable.available) return totalMinutes
			const dateTime = musicianAvailable.endTime.toDate()
			return dateTime.getHours() * 60 + dateTime.getMinutes() - startMinutes
		})
	)

	const somebodyUnavailable = musicians.some(
		(x) =>
			nonNullMusicianAvailabilities[x.participantId] &&
			!nonNullMusicianAvailabilities[x.participantId]!.available
	)

	const somebodyNotGiven = musicians.some((x) => !nonNullMusicianAvailabilities[x.participantId])

	const timeslotPossible = minStartTime < maxEndTime

	$: showParticipants = false
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

	{#if somebodyUnavailable}
		<Column class="somebody-unavailable">Somebody is unavailable</Column>
	{:else if timeslotPossible}
		{#if minStartTime > 0}
			<Column
				class="red"
				style={`max-width: ${(minStartTime / totalMinutes) * 100}% !important;`}
			/>
		{/if}
		<Column
			class="green"
			style={`max-width: ${((maxEndTime - minStartTime) / totalMinutes) * 100}%;`}
		/>
		{#if maxEndTime < totalMinutes}
			<Column
				class="red"
				style={`max-width: ${((totalMinutes - maxEndTime) / totalMinutes) * 100}% !important;`}
			/>
		{/if}
	{/if}
</Row>
{#if showParticipants}
	<ScrollableList condensed classname="availability-list">
		<StructuredListBody>
			{#each musicians as musician}
				{@const availability = nonNullMusicianAvailabilities[musician.participantId]}
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
								Unavailable: <br />
								{availability.reason}
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

	:global(.somebody-unavailable) {
		background-color: #ef0612;
		text-align: center;
		padding-top: 15px;
	}

	:global(.red) {
		background-color: #ef0612;
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
