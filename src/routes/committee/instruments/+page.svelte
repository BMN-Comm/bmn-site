<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { db } from '$lib/firebase/client/firebase'
	import type { PageData } from './$types'
	import {
		Button,
		Column,
		Form,
		Grid,
		Modal,
		Row,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow,
		TextInput
	} from 'carbon-components-svelte'
	import { MusicAdd, MusicRemove } from 'carbon-icons-svelte'
	import {
		addDoc,
		collection,
		deleteDoc,
		doc
	} from 'firebase/firestore'
	import ScrollableList from '$lib/components/scrollableList.svelte'

	export let data: PageData

	let name: string

	let selectedInstrumentIndex: number

	let openDel = false
	let openAdd = false
	
	// Delete the instrument from the database
	async function DeleteInstrument() {
		const announcementRef = doc(db, 'instruments', data.instruments[selectedInstrumentIndex].id)
		await deleteDoc(announcementRef)

		invalidateAll()
	}

	// Create a new instrument in the database
	async function CreateInstrument() {
		await addDoc(collection(db, 'instruments'), {
			name
		})

		invalidateAll()

		name = ''
	}

</script>

<Grid>
	<Row>
		<Column><h1 class="titleText">Instruments</h1></Column>
		<Column>
			<Button 
				class="alignRight"
				icon={MusicAdd}
				iconDescription={"Add new instrument"}
				on:click={() => {
					openAdd = true
				}}
			/>
		</Column>
	</Row>

	<ScrollableList condensed>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Name</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each data.instruments as instrument, i}
			<StructuredListRow>
				<StructuredListCell>{instrument.name}</StructuredListCell>
				<StructuredListCell>
					<Button
						kind="danger-tertiary"
						size="small"
						iconDescription="Delete"
						icon={MusicRemove}
						on:click={() => {
							selectedInstrumentIndex = i
							openDel = true
						}}
					/>
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</ScrollableList>
</Grid>

<Modal
	danger
	modalHeading="Create new instument"
	primaryButtonText="Submit"
	primaryButtonIcon={MusicAdd}
	secondaryButtonText="Cancel"
	bind:open={openAdd}
	on:click:button--primary={() => {
		CreateInstrument()
		openAdd = false
	}}
	on:click:button--secondary={() => {
		openAdd = false
	}}
	selectorPrimaryFocus="#name"
>
	<Form>
		<TextInput
			id="name"
			label="Name"
			placeholder="Name"
			bind:value={name} 
		/>
	</Form>
</Modal>

<Modal
	danger
	modalHeading="Delete instument"
	primaryButtonText="Delete"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDel}
	on:click:button--primary={() => {
		DeleteInstrument()
		openDel = false
	}}
	on:click:button--secondary={() => {
		openDel = false
	}}
>
	<p>Delete {data.instruments[selectedInstrumentIndex]?.name}?</p>
</Modal>

<style>
	:global(.alignRight) {
		float: inline-end;
		margin-right: 20px;
	}
</style>
