<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { NewAvailability } from '$lib/types/domain/availability'
	import {
		Grid,
		Column,
		Row,
		TimePicker,
		Checkbox,
		Button,
		TextInput
	} from 'carbon-components-svelte'
	import { Save } from 'carbon-icons-svelte'
	import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
	import { page } from '$app/stores'
	import { getTimeString } from '$lib/util/timeString'
	import type { PageData } from './$types'
	import { newTimeOnDay } from '$lib/util/date'

	export let data: PageData

	const minTime = getTimeString(data.rehearsal.startTime)
	const maxTime = getTimeString(data.rehearsal.endTime)

	let available: boolean = data.availability?.available ?? true
	let remarksText: string | undefined = data.availability?.reason

	let startTime: string = getTimeString(data.availability?.startTime ?? data.rehearsal.startTime)
	let endTime: string = getTimeString(data.availability?.endTime ?? data.rehearsal.endTime)

	let startTimeInvalid: boolean = false
	let endTimeInvalid: boolean = false

	async function SaveAvailability() {
		const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

		startTimeInvalid = !timeRegex.test(startTime)
		endTimeInvalid = !timeRegex.test(endTime)

		if (startTimeInvalid || endTimeInvalid) return

		const rehearsalStart = data.rehearsal.startTime.toDate()
		const rehearsalEnd = data.rehearsal.endTime.toDate()

		// If the participant is not available, this is for the entire rehearsal
		if (!available) {
			startTime = minTime
			endTime = maxTime
		}

		const start = startTime.split(':')
		const end = endTime.split(':')

		const availableStart = newTimeOnDay(rehearsalStart, parseInt(start[0]), parseInt(start[1]))
		const availableEnd = newTimeOnDay(rehearsalEnd, parseInt(end[0]), parseInt(end[1]))

		startTimeInvalid =
			rehearsalStart > availableStart ||
			rehearsalEnd < availableStart ||
			availableStart > availableEnd
		endTimeInvalid = rehearsalStart > availableEnd || rehearsalEnd < availableEnd

		if (startTimeInvalid || endTimeInvalid) return

		const newAvailibilityDoc: NewAvailability = {
			available,
			rehearsal: data.availability?.rehearsal ?? doc(db, 'rehearsals/' + data.rehearsal.id),
			reason: remarksText,
			startTime: Timestamp.fromDate(availableStart),
			endTime: Timestamp.fromDate(availableEnd)
		}

		const availabilityRef =
			data.availability?.id !== undefined
				? doc(db, 'users/' + $page.data.user!.databaseId + '/availability/' + data.availability!.id)
				: doc(collection(db, 'users/' + $page.data.user!.databaseId + '/availability'))

		await setDoc(availabilityRef, newAvailibilityDoc)

		window.location.replace('/participant/availability')
	}

	function toggleAvailable() {
		available = !available
		if (!available) {
			startTime = minTime
			endTime = maxTime
		}
	}
</script>

<Grid>
	<Row>
		<Column>
			<h1>
				Submit your availability for {data.rehearsal.startTime.toDate().toDateString()}
			</h1>
		</Column>
	</Row>
	<Row>
		<Column sm={2} lg={2}>
			<TimePicker
				labelText="Start time"
				bind:value={startTime}
				disabled={!available}
				required
				invalid={startTimeInvalid}
			/>
		</Column>
		<Column sm={2} lg={2}>
			<TimePicker
				labelText="End time"
				bind:value={endTime}
				disabled={!available}
				required
				invalid={endTimeInvalid}
			/>
		</Column>
		<Column sm={4} lg={12} padding>
			<Checkbox
				labelText="Not Available"
				checked={!available}
				on:change={() => toggleAvailable()}
			/>
		</Column>
	</Row>
	<Row padding>
		<Column lg={6}>
			<TextInput
				placeholder={available ? 'Remarks' : 'Remarks*'}
				bind:value={remarksText}
				required={!available}
			/>
		</Column>
	</Row>
	<Row padding>
		<Column>
			<Button icon={Save} on:click={SaveAvailability}>Save</Button>
		</Column>
	</Row>
</Grid>

<style>
	/* For some reasong this one is set to 2,5rem with messed up the formatting */
	:global(.bx--text-input--invalid) {
		padding-right: 16px;
	}
</style>
