<script lang="ts">
	import {
	Button,
		Column,
		DatePicker,
		DatePickerInput,
		ExpandableTile,
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
	import { Add, Launch } from 'carbon-icons-svelte'
	import type { Timestamp } from 'firebase/firestore'

	export let data: { rehearsals: rehearsal[] }

	let openModal = false
	let location: string = "dB's"
	let date: string
	let startTime: string = "18:00"
	let endTime: string = "21:00"

	async function addRehearsal() {
		console.log(date)
		console.log(startTime)
		console.log(endTime)
	}

</script>



<Grid>
	<Row padding>
		<Column><h1>Geplande Repetities</h1></Column>
	</Row>
	<Row>
		<Column>
			<Button iconDescription="Voeg repetitiedag toe" icon={Add} on:click={() => {openModal = true}}/>
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
						{rehearsal.startTime.toDate().getHours()}:{String(
							rehearsal.startTime.toDate().getMinutes()
						).padStart(2, '0')} -
						{rehearsal.endTime.toDate().getHours()}:{String(
							rehearsal.endTime.toDate().getMinutes()
						).padStart(2, '0')}
					</StructuredListCell>
					<StructuredListCell>
						{rehearsal.location}
					</StructuredListCell>
					<StructuredListCell>
						<a href={`/participant/schedule/${rehearsal.id}`}><Launch /></a>
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
	on:submit={(e) => {
		e.preventDefault
		addRehearsal()
	}}
>
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
					<DatePicker datePickerType="single" dateFormat="d/M/Y" bind:value={date} required>
						<DatePickerInput labelText="Datum" placeholder="dd/mm/yyyy"/>
					</DatePicker>
				</Column>
				<Column>
					<TimePicker
						labelText="Van"
						bind:value={startTime}
						required
					/>
				</Column>
				<Column>
					<TimePicker
						labelText="Tot"
						bind:value={endTime}
						required
					/>
				</Column>
			</Row>
		</Grid>
	</Form>
</Modal>