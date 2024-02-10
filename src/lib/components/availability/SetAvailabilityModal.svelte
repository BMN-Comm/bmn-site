<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { db } from '$lib/firebase/client/firebase'
	import type { Availability, NewAvailability } from '$lib/types/domain/availability'
	import type { Rehearsal } from '$lib/types/domain/rehearsal'
	import { newTimeOnDay } from '$lib/util/date'
	import { getTimeString } from '$lib/util/timeString'
	import {
		Modal,
		Grid,
		Row,
		Column,
		TextInput,
		Checkbox,
		TimePicker
	} from 'carbon-components-svelte'
	import { Edit } from 'carbon-icons-svelte'
	import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'

	export let rehearsal: Rehearsal
	export let user: { id: string; name: string }
	export let availability: Availability | undefined = undefined

	export let displayUserName: boolean = false

	export let openSetAvailability = false
	export let onClose: () => void

	let setOrUpdate = availability ? 'Update' : 'Set'

	let available = availability?.available ?? true
	let remark: string | undefined = availability?.reason

	let startTimeString: string = getTimeString(availability?.startTime ?? rehearsal.startTime)
	let endTimeString: string = getTimeString(availability?.endTime ?? rehearsal.endTime)
	let startTimeInvalid: boolean = false
	let endTimeInvalid: boolean = false

	/**
	 * Submit or update the availability in the database.
	 * @returns `true` if the mutation was successful, `false` otherwise.
	 */
	async function saveAvailability(): Promise<boolean> {
		// Time input validation
		const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
		startTimeInvalid = !timeRegex.test(startTimeString)
		endTimeInvalid = !timeRegex.test(endTimeString)
		if (startTimeInvalid || endTimeInvalid) return false

		// If the participant is not available, they are unavailable for the entire rehearsal
		if (!available) {
			startTimeString = getTimeString(rehearsal.startTime)
			endTimeString = getTimeString(rehearsal.endTime)
		}

		// Check if the availability is within the rehearsal time and if the start time is before the end time
		const rehearsalStart = rehearsal.startTime.toDate()
		const rehearsalEnd = rehearsal.endTime.toDate()

		const start = startTimeString.split(':')
		const end = endTimeString.split(':')

		const availableStart = newTimeOnDay(rehearsalStart, parseInt(start[0]), parseInt(start[1]))
		const availableEnd = newTimeOnDay(rehearsalEnd, parseInt(end[0]), parseInt(end[1]))

		startTimeInvalid =
			rehearsalStart > availableStart ||
			rehearsalEnd < availableStart ||
			availableStart >= availableEnd
		endTimeInvalid =
			rehearsalStart > availableEnd || rehearsalEnd < availableEnd || availableStart >= availableEnd

		if (startTimeInvalid || endTimeInvalid) return false

		// Save the availability to the database
		const newAvailibilityDoc: NewAvailability = {
			available,
			rehearsal: doc(db, 'rehearsals/' + rehearsal.id),
			reason: remark,
			startTime: Timestamp.fromDate(availableStart),
			endTime: Timestamp.fromDate(availableEnd)
		}

		const availabilityRef =
			availability?.id !== undefined
				? doc(db, 'users/' + user.id + '/availability/' + availability.id)
				: doc(collection(db, 'users/' + user.id + '/availability'))

		await setDoc(availabilityRef, newAvailibilityDoc)

		invalidateAll()

		return true
	}

	function toggleAvailable() {
		available = !available
		if (!available) {
			startTimeString = getTimeString(rehearsal.startTime)
			endTimeString = getTimeString(rehearsal.endTime)
		}
	}
</script>

<Modal
	modalHeading={`${setOrUpdate} availability`}
	bind:open={openSetAvailability}
	primaryButtonText="Submit"
	primaryButtonIcon={Edit}
	secondaryButtonText="Cancel"
	on:click:button--primary={async () => {
		const success = await saveAvailability()
		openSetAvailability = !success
	}}
	on:click:button--secondary={() => {
		openSetAvailability = false
	}}
	on:close={() => onClose()}
>
	<Grid>
		<Row padding>
			<Column>
				{`${setOrUpdate} ${
					displayUserName ? user.name + "'s" : 'your'
				} availability for ${rehearsal.startTime.toDate().toDateString()}`}
			</Column>
		</Row>
		<Row padding>
			<Column>
				<TimePicker
					labelText="Start time"
					bind:value={startTimeString}
					disabled={!available}
					required
					invalid={startTimeInvalid}
				/>
			</Column>
			<Column>
				<TimePicker
					labelText="End time"
					bind:value={endTimeString}
					disabled={!available}
					required
					invalid={endTimeInvalid}
				/>
			</Column>
		</Row>
		<Row>
			<Column>
				<Checkbox
					labelText="Not available"
					checked={!available}
					on:change={() => toggleAvailable()}
				/>
			</Column>
		</Row>
		<Row padding>
			<Column>
				<TextInput placeholder="Remark(s)" bind:value={remark} />
			</Column>
		</Row>
	</Grid>
</Modal>

<style>
	/* Make the time picker full width of the column */
	:global(.bx--time-picker__input-field, .bx--time-picker__input, .bx--time-picker) {
		width: 100%;
	}
</style>
