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
	import { Add, Edit, Launch, MusicRemove, Person } from 'carbon-icons-svelte'
	import { collection, deleteDoc, doc, getDoc, query, setDoc, Timestamp, updateDoc, where, type DocumentData } from 'firebase/firestore'
	import { db } from '$lib/firebase/client/firebase'
	import { getTimeString } from '$lib/util/timeString'
	import { newRehearsalPost } from '$lib/util/webhook'
	import { invalidateAll } from '$app/navigation'
	import type { PageData } from './$types'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import type { rehearsal, rehearsalInfo } from '$lib/types/domain/rehearsal'

	export let data: PageData

	let openAddModal = false
	let openDeleteModal = false
	let openEditModal = false
	let location: string = ''
	let date: string
	let startTime: string = '18:00'
	let endTime: string = '21:00'

	let selectedRehearsalId: number

	/** Add a new rehearsal date to the database */
	async function addRehearsal() {
		let dateSplit = date.split('/')
		let sTimeSplit = startTime.split(':')
		let eTimeSplit = endTime.split(':')

		let rehearsal: rehearsalInfo = {
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

		location = ''
		date = ''
		startTime = '18:00'
		endTime = '21:00'

		invalidateAll()
	}

	/** Edit a rehearsal in the database */
	async function editRehearsal() {
		// Get the reference to the document
		const docRef = doc(db, 'rehearsals', data.rehearsals[selectedRehearsalId].id)

		let dateSplit = date.split('/')
		let sTimeSplit = startTime.split(':')
		let eTimeSplit = endTime.split(':')

		// And update it in the database
		await updateDoc(docRef, {
			startTime: Timestamp.fromDate(
				new Date(+dateSplit[2], +dateSplit[1] - 1, +dateSplit[0], +sTimeSplit[0], +sTimeSplit[1])
			),
			endTime: Timestamp.fromDate(
				new Date(+dateSplit[2], +dateSplit[1] - 1, +dateSplit[0], +eTimeSplit[0], +eTimeSplit[1])
			),
			location: location
		})

		// Also reset the values for in the modal
		location = ''
		date = ''
		startTime = '18:00'
		endTime = '21:00'

		invalidateAll()
	}

	/** Remove a rehearsal from the database */
	async function removeRehearsal() {
		const docRef = doc(db, 'rehearsals', data.rehearsals[selectedRehearsalId].id)

		await deleteDoc(docRef)

		invalidateAll()
	}

	/** Set the current date and location of the active rehearsal */
	function setRehearsalState(rehearsal: rehearsal) {
		location = rehearsal.location
		startTime = rehearsal.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		endTime = rehearsal.endTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		date = rehearsal.startTime.toDate().toLocaleDateString(['en-GB'])
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
					openAddModal = true
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
							href={`/committee/rehearsals/${rehearsal.id}/schedule`}
						/>
						<Button
							size="small"
							iconDescription="Show availability"
							icon={Person}
							href={`/committee/rehearsals/${rehearsal.id}/availability`}
						/>
						<Button
							size="small"
							iconDescription="Edit rehearsal"
							icon={Edit}
							on:click={async () => {
								selectedRehearsalId = i
								setRehearsalState(rehearsal)
								openEditModal = true
							}}
						/>
						<Button
							kind="danger-tertiary"
							size="small"
							iconDescription="Remove rehearsal"
							icon={MusicRemove}
							on:click={() => {
								selectedRehearsalId = i
								openDeleteModal = true
							}}
						/>
					</StructuredListCell>
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</ScrollableList>
</Grid>

<Modal
	bind:open={openAddModal}
	modalHeading="New rehearsal"
	primaryButtonIcon={Add}
	primaryButtonText="Add"
	hasScrollingContent
	hasForm
	selectorPrimaryFocus="#location"
	on:submit={(e) => {
		e.preventDefault()
		addRehearsal()
		openAddModal = false
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
							<DatePickerInput labelText="Date" placeholder="dd/mm/yyyy" />
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
 	modalHeading="Edit rehearsal"
	primaryButtonText="Edit"
	primaryButtonIcon={Edit}
	secondaryButtonText="Cancel"
	bind:open={openEditModal}
	on:click:button--primary={() => {
		editRehearsal()
		openEditModal = false
	}}
	on:click:button--secondary={() => {
		openEditModal = false
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
							<DatePickerInput labelText="Date" placeholder="dd/mm/yyyy" />
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
	bind:open={openDeleteModal}
	on:click:button--primary={() => {
		removeRehearsal()
		openDeleteModal = false
	}}
	on:click:button--secondary={() => {
		openDeleteModal = false
	}}
>
	<p>Remove rehearsal?</p>
</Modal>

<style>
	.modal {
		height: 500px;
	}
</style>
