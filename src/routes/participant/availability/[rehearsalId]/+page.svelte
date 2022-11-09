<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { availability } from '$lib/types/domain/availability'
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

	export let data: { rehearsal: rehearsal; availability: availability }

	let available: boolean = true
	let remarksText: string
	let startTime: string = getTimeString(data.availability.startTime)
	let endTime: string = getTimeString(data.availability.endTime)

	if (data.availability.reason != null) {
		remarksText = data.availability.reason
	}

	function ChangeAvailability() {
		available = !available
	}

	async function SaveAvailability() {
		let a: availability

		if (!available) {
			a = {
				available: false,
				rehearsal: data.availability.rehearsal,
				reason: remarksText,
				startTime: Timestamp.fromDate(
					new Date(
						data.rehearsal.startTime.toDate().getFullYear(),
						data.rehearsal.startTime.toDate().getMonth(),
						data.rehearsal.startTime.toDate().getDate(),
						+startTime.split(':')[0],
						+startTime.split(':')[1]
					)
				),
				endTime: Timestamp.fromDate(
					new Date(
						data.rehearsal.endTime.toDate().getFullYear(),
						data.rehearsal.endTime.toDate().getMonth(),
						data.rehearsal.endTime.toDate().getDate(),
						+endTime.split(':')[0],
						+endTime.split(':')[1]
					)
				)
			}
		} else {
			a = {
				available: true,
				startTime: Timestamp.fromDate(
					new Date(
						data.rehearsal.startTime.toDate().getFullYear(),
						data.rehearsal.startTime.toDate().getMonth(),
						data.rehearsal.startTime.toDate().getDate(),
						+startTime.split(':')[0],
						+startTime.split(':')[1]
					)
				),
				endTime: Timestamp.fromDate(
					new Date(
						data.rehearsal.endTime.toDate().getFullYear(),
						data.rehearsal.endTime.toDate().getMonth(),
						data.rehearsal.endTime.toDate().getDate(),
						+endTime.split(':')[0],
						+endTime.split(':')[1]
					)
				),
				rehearsal: data.availability.rehearsal,
				reason: remarksText
			}
		}

		if (data.availability.id != '') {
			const availabilityRef = doc(
				db,
				'users/' + $page.data.user?.databaseId + '/availability/' + data.availability.id
			)
			await updateDoc(availabilityRef, a)
		} else {
			const availabilityRef = doc(
				collection(db, 'users/' + $page.data.user?.databaseId + '/availability')
			)
			await setDoc(availabilityRef, a)
		}
	}
</script>

<h1>Rehearsals {data.rehearsal.startTime.toDate().toDateString()}</h1>

<Grid>
	<Row>
		{#if available}
			<Column lg={2}>
				<TimePicker labelText="Start time" bind:value={startTime} />
			</Column>
			<Column lg={2}>
				<TimePicker labelText="End time" bind:value={endTime} />
			</Column>
		{:else}
			<Column lg={2}>
				<TimePicker labelText="Start time" bind:value={startTime} disabled />
			</Column>
			<Column lg={2}>
				<TimePicker labelText="End time" bind:value={endTime} disabled />
			</Column>
		{/if}
		<Column padding>
			<Checkbox labelText="Not Available" bind:value={available} on:change={ChangeAvailability} />
		</Column>
	</Row>
	<Row padding>
		<Column lg={6}>
			{#if available}
				<TextInput placeholder="Remarks" bind:value={remarksText} />
			{:else}
				<TextInput placeholder="Remarks*" bind:value={remarksText} required />
			{/if}
		</Column>
	</Row>
	<Row padding>
		<Column>
			<Button icon={Save} on:click={SaveAvailability}>Save</Button>
		</Column>
	</Row>
</Grid>
