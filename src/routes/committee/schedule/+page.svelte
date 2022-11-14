<script lang="ts">
	import {
		Button,
		Column,
		DatePicker,
		DatePickerInput,
		Form,
		Grid,
		Modal,
		Row,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow,
		TextInput,
		TimePicker
	} from 'carbon-components-svelte'
	import { Add, Launch, MusicRemove, Person } from 'carbon-icons-svelte'
	import { collection, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore'
	import { db } from '$lib/firebase/client/firebase'
	import { getTimeString } from '$lib/util/timeString'
	import { newRehearsalPost } from '$lib/util/webhook'
	import { invalidateAll } from '$app/navigation'
	import type { PageData } from './$types'
	import ScrollableList from '$lib/components/scrollableList.svelte'

	export let data: PageData

	let openModal = false
	let openDel = false
	let location: string = "dB's"
	let date: string
	let startTime: string = '18:00'
	let endTime: string = '21:00'

	let selectedRehearsal: number

	/** Add a new rehearsal date to the database */
	async function addRehearsal() {
		let dateSplit = date.split('/')
		let sTimeSplit = startTime.split(':')
		let eTimeSplit = endTime.split(':')

		let rehearsal = {
			// TODO: Use current edition
			edition: doc(db, 'editions/ZI3Eab1mXjHvCUS47o40'),
			startTime: Timestamp.fromDate(
				new Date(+dateSplit[2], +dateSplit[1] - 1, +dateSplit[0], +sTimeSplit[0], +sTimeSplit[1])
			),
			endTime: Timestamp.fromDate(
				new Date(+dateSplit[2], +dateSplit[1] - 1, +dateSplit[0], +eTimeSplit[0], +eTimeSplit[1])
			),
			location
		}

		const newRehearsal = doc(collection(db, 'rehearsals'))

		await setDoc(newRehearsal, rehearsal)
		newRehearsalPost(newRehearsal.id, rehearsal)

		date = ''
		startTime = '18:00'
		endTime = '21:00'
		openModal = false

		invalidateAll()
	}

	/** Remove a rehearsal from the database */
	async function removeRehearsal() {
		const docRef = doc(db, 'rehearsals', data.rehearsals[selectedRehearsal].id)
		await deleteDoc(docRef)

		invalidateAll()
	}
</script>

<Grid>
	<Row padding>
		<Column><h1>Planned rehearsals</h1></Column>
	</Row>
	<Row>
		<Column>
			<Button
				iconDescription="Add rehearsal"
				icon={Add}
				on:click={() => {
					openModal = true
				}}
			/>
		</Column>
	</Row>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Date</StructuredListCell>
				<StructuredListCell head>Time</StructuredListCell>
				<StructuredListCell head>Location</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#each data.rehearsals as rehearsal, i}
				<StructuredListRow>
					<StructuredListCell>
						{rehearsal.startTime.toDate().toDateString()}
					</StructuredListCell>
					<StructuredListCell>
						{getTimeString(rehearsal.startTime)} -
						{getTimeString(rehearsal.endTime)}
					</StructuredListCell>
					<StructuredListCell>
						{rehearsal.location}
					</StructuredListCell>
					<StructuredListCell>
						<Button
							size="small"
							iconDescription="Open rehearsal"
							icon={Launch}
							href={`/committee/schedule/${rehearsal.id}`}
						/>
						<Button
							size="small"
							iconDescription="Show availability"
							icon={Person}
							href={`/committee/schedule/${rehearsal.id}/availability`}
						/>
						<Button
							kind="danger-tertiary"
							size="small"
							iconDescription="Remove rehearsal"
							icon={MusicRemove}
							on:click={() => {
								selectedRehearsal = i
								openDel = true
							}}
						/>
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</ScrollableList>
</Grid>

<Modal
	bind:open={openModal}
	modalHeading="New rehearsal"
	primaryButtonIcon={Add}
	primaryButtonText="Add"
	hasScrollingContent
	hasForm
	selectorPrimaryFocus="#location"
	on:submit={(e) => {
		e.preventDefault()
		addRehearsal()
	}}
>
	<div class="modal">
		<Form>
			<Grid>
				<Row padding>
					<Column>
						<TextInput
							id="location"
							labelText="Location"
							placeholder="Location"
							bind:value={location}
							required
						/>
					</Column>
				</Row>
				<Row>
					<Column>
						<DatePicker datePickerType="single" dateFormat="d/m/Y" bind:value={date} required>
							<DatePickerInput labelText="Datum" placeholder="dd/mm/yyyy" />
						</DatePicker>
					</Column>
					<Column>
						<TimePicker labelText="From" bind:value={startTime} required />
					</Column>
					<Column>
						<TimePicker labelText="Till" bind:value={endTime} required />
					</Column>
				</Row>
			</Grid>
		</Form>
	</div>
</Modal>

<Modal
	danger
	modalHeading="Remove rehearsal"
	primaryButtonText="Remove"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDel}
	on:click:button--primary={() => {
		removeRehearsal()
		openDel = false
	}}
	on:click:button--secondary={() => {
		openDel = false
	}}
>
	<p>Remove rehearsal?</p>
</Modal>

<style>
	.modal {
		height: 500px;
	}
</style>
