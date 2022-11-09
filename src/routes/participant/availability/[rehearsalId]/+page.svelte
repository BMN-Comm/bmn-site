<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { availability, newAvailability } from '$lib/types/domain/availability'
	import type { rehearsal } from '$lib/types/domain/rehearsal'
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

	export let data: { rehearsal: rehearsal; availability?: availability }

	if (data.availability === undefined) {
		const rehearsalRef = doc(db, 'rehearsals/', data.rehearsal.id)
		data.availability = {
			id: '',
			available: true,
			startTime: data.rehearsal.startTime,
			endTime: data.rehearsal.endTime,
			rehearsal: rehearsalRef,
			reason: ''
		}
	}

	let available: boolean = true
	let remarksText: string | undefined = data.availability.reason || undefined
	let startTime: string = getTimeString(data.availability.startTime)
	let endTime: string = getTimeString(data.availability.endTime)

	function ChangeAvailability() {
		available = !available
	}

	async function SaveAvailability() {
		let a: newAvailability
		let startDate = data.rehearsal.startTime.toDate()
		let endDate = data.rehearsal.endTime.toDate()
		let start = startTime.split(':')
		let end = endTime.split(':')
		startDate.setHours(+start[0], +start[1])
		endDate.setHours(+end[0], +end[1])

		if (!available) {
			a = {
				available: false,
				rehearsal: data.availability!.rehearsal,
				reason: remarksText,
				startTime: Timestamp.fromDate(startDate),
				endTime: Timestamp.fromDate(endDate)
			}
		} else {
			a = {
				available: true,
				startTime: Timestamp.fromDate(startDate),
				endTime: Timestamp.fromDate(endDate),
				rehearsal: data.availability!.rehearsal,
				reason: remarksText
			}
		}

		if (data.availability!.id != '') {
			const availabilityRef = doc(
				db,
				'users/' + $page.data.user!.databaseId + '/availability/' + data.availability!.id
			)
			await updateDoc(availabilityRef, a)
		} else {
			const availabilityRef = doc(
				collection(db, 'users/' + $page.data.user!.databaseId + '/availability')
			)
			await setDoc(availabilityRef, a)
		}
	}
</script>

<h1>Rehearsals {data.rehearsal.startTime.toDate().toDateString()}</h1>

<Grid>
	<Row>
		<Column lg={2}>
			<TimePicker labelText="Start time" bind:value={startTime} disabled={!available} />
		</Column>
		<Column lg={2}>
			<TimePicker labelText="End time" bind:value={endTime} disabled={!available} />
		</Column>
		<Column padding>
			<Checkbox labelText="Not Available" bind:value={available} on:change={ChangeAvailability} />
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
