<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { newAvailability } from '$lib/types/domain/availability'
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
	import { collection, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
	import { page } from '$app/stores'
	import { getTimeString } from '$lib/util/timeString'
	import type { PageData } from './$types'

	export let data: PageData

	const minTime = getTimeString(data.rehearsal.startTime)
	const maxTime = getTimeString(data.rehearsal.endTime)

	let available: boolean = data.availability?.available ?? true
	let remarksText: string | undefined = data.availability?.reason
	let startTime: string = getTimeString(data.availability?.startTime ?? data.rehearsal.startTime)
	let endTime: string = getTimeString(data.availability?.endTime ?? data.rehearsal.endTime)

	async function SaveAvailability() {
		const startDate = data.rehearsal.startTime.toDate()
		const endDate = data.rehearsal.endTime.toDate()
		if (available) {
			const start = startTime.split(':')
			const end = endTime.split(':')
			startDate.setHours(+start[0], +start[1])
			endDate.setHours(+end[0], +end[1])
		}

		const newAvailibilityDoc: newAvailability = {
			available,
			rehearsal: data.availability?.rehearsal ?? doc(db, 'rehearsals/' + data.rehearsal.id),
			reason: remarksText,
			startTime: Timestamp.fromDate(startDate),
			endTime: Timestamp.fromDate(endDate)
		}

		const availabilityRef =
			data.availability?.id !== undefined
				? doc(db, 'users/' + $page.data.user!.databaseId + '/availability/' + data.availability!.id)
				: doc(collection(db, 'users/' + $page.data.user!.databaseId + '/availability'))

		await setDoc(availabilityRef, newAvailibilityDoc)

		window.location.replace('/participant/availability')
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
				min={minTime}
				max={maxTime}
				disabled={!available}
			/>
		</Column>
		<Column sm={2} lg={2}>
			<TimePicker
				labelText="End time"
				bind:value={endTime}
				min={minTime}
				max={maxTime}
				disabled={!available}
			/>
		</Column>
		<Column sm={4} lg={12} padding>
			<Checkbox
				labelText="Not Available"
				checked={!available}
				on:change={() => {
					available = !available
				}}
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
