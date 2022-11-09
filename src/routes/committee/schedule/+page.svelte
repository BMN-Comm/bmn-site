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
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow,
		TextInput,
		TimePicker
	} from 'carbon-components-svelte'
	import type { rehearsal } from '$lib/types/domain/rehearsal'
	import { Add, Launch, MusicRemove, Person } from 'carbon-icons-svelte'
	import { collection, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore'
	import { db } from '$lib/firebase/client/firebase'
	import { getTimeString } from '$lib/util/timeString'
	import { newRehearsalPost } from '$lib/util/webhook'

	export let data: { rehearsals: rehearsal[] }

	let openModal = false
	let openDel = false
	let location: string = "dB's"
	let date: string
	let startTime: string = '18:00'
	let endTime: string = '21:00'

	let selectedRehearsal: number

	async function addRehearsal() {
		let start: Timestamp
		let end: Timestamp

		// TODO: Rienk: check of dit beter kan
		let dateSplit = date.split('/')
		let sTimeSplit = startTime.split(':')
		let eTimeSplit = endTime.split(':')

		let sDate: Date = new Date(
			+dateSplit[2],
			+dateSplit[1] - 1,
			+dateSplit[0],
			+sTimeSplit[0],
			+sTimeSplit[1]
		)
		let eDate: Date = new Date(
			+dateSplit[2],
			+dateSplit[1] - 1,
			+dateSplit[0],
			+eTimeSplit[0],
			+eTimeSplit[1]
		)

		start = Timestamp.fromDate(sDate)
		end = Timestamp.fromDate(eDate)

		const newRehearsal = doc(collection(db, 'rehearsals'))

		let rehearsal = {
			// TODO: Use current edition
			id: newRehearsal.id,
			edition: doc(db, 'editions/ZI3Eab1mXjHvCUS47o40'),
			startTime: start,
			endTime: end,
			location
		}

		await setDoc(newRehearsal, rehearsal)
		newRehearsalPost(rehearsal)
	}

	function removeRehearsal() {
		data.rehearsals.splice(selectedRehearsal, 1)
		data = data

		const docRef = doc(db, 'songs', data.rehearsals[selectedRehearsal].id)
		deleteDoc(docRef)
	}
</script>

<Grid>
	<Row padding>
		<Column><h1>Geplande Repetities</h1></Column>
	</Row>
	<Row>
		<Column>
			<Button
				iconDescription="Voeg repetitiedag toe"
				icon={Add}
				on:click={() => {
					openModal = true
				}}
			/>
		</Column>
	</Row>
	<StructuredList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Datum</StructuredListCell>
				<StructuredListCell head>Tijd</StructuredListCell>
				<StructuredListCell head>Locatie</StructuredListCell>
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
							iconDescription="Open Repetitie"
							icon={Launch}
							href={`/committee/schedule/${rehearsal.id}`}
						/>
						<Button
							size="small"
							iconDescription="Show availability"
							icon={Person}
							href={`/committee/schedule/availability/${rehearsal.id}`}
						/>
						<Button
							kind="danger-tertiary"
							size="small"
							iconDescription="Verwijder Repetitie"
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
	</StructuredList>
</Grid>

<Modal
	bind:open={openModal}
	modalHeading="Nieuwe repetitiedag"
	primaryButtonIcon={Add}
	primaryButtonText="Voeg toe"
	hasScrollingContent
	hasForm
	selectorPrimaryFocus="#locatie"
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
							id="locatie"
							labelText="Locatie"
							placeholder="Locatie"
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
						<TimePicker labelText="Van" bind:value={startTime} required />
					</Column>
					<Column>
						<TimePicker labelText="Tot" bind:value={endTime} required />
					</Column>
				</Row>
			</Grid>
		</Form>
	</div>
</Modal>

<Modal
	danger
	modalHeading="Verwijder repetitie"
	primaryButtonText="Verwijder"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Annuleer"
	bind:open={openDel}
	on:click:button--primary={() => {
		removeRehearsal()
		openDel = false
	}}
	on:click:button--secondary={() => {
		openDel = false
	}}
>
	<p>Verwijder repetitie?</p>
</Modal>

<style>
	.modal {
		height: 500px;
	}
</style>
