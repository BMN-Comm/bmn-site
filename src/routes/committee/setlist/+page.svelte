<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import { db } from '$lib/firebase/client/firebase'
	import type { PageData } from './$types'
	import {
		Button,
		Column,
		ComboBox,
		Form,
		Grid,
		Modal,
		Row,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow,
		TextInput
	} from 'carbon-components-svelte'
	import type { DropdownItem } from 'carbon-components-svelte/types/Dropdown/Dropdown.svelte'
	import { MusicRemove, UserFollow } from 'carbon-icons-svelte'
	import {
		addDoc,
		arrayRemove,
		collection,
		deleteDoc,
		doc,
		getDocs,
		query,
		updateDoc,
		where
	} from 'firebase/firestore'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import { editionId } from '$lib/types/domain/edition'

	export let data: PageData

	let selectedSong: number
	let selectedUserEntry: number
	let selectedUserId: string
	let selectedUserName: string
	let selectedInstrumentId: string
	let openDel = false
	let openDelUser = false
	let openAdd = false

	let participantListItems: DropdownItem[] = data.users.map(
		(user) => ({ id: user.id, text: user.name } as DropdownItem)
	)

	let instrumentListItems: DropdownItem[] = data.instruments.map(
		(instrument) => ({ id: instrument.id, text: instrument.name } as DropdownItem)
	)

	let participant: string
	let instrument: string

	async function RemoveSongFromSetlist() {
		const editionRef = doc(db, editionId)
		updateDoc(editionRef, {
			songs: arrayRemove(doc(db, 'songs', data.songs[selectedSong].id))
		})
		invalidateAll()
	}

	async function AddParticipantToSong() {
		await addDoc(collection(db, 'users/' + participant + '/playsSongs'), {
			part: doc(db, 'instruments', instrument),
			song: doc(db, 'songs', data.songs[selectedSong].id)
		})

		invalidateAll()
	}

	async function RemoveParticipantFromSong() {
		const songRef = doc(db, 'songs', data.songs[selectedSong].id)
		const instrumentRef = doc(db, 'instruments', selectedInstrumentId)

		const playsInQuery = query(
			collection(db, 'users', selectedUserId, 'playsSongs'),
			where('song', '==', songRef),
			where('part', '==', instrumentRef)
		)
		const playsInDoc = (await getDocs(playsInQuery)).docs[0].ref

		await deleteDoc(playsInDoc)

		invalidateAll()
	}
</script>

<Grid>
	<Row>
		<Column><h1 class="titleText">Setlist</h1></Column>
	</Row>

	<ScrollableList condensed>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Artist</StructuredListCell>
				<StructuredListCell head>Link</StructuredListCell>
				<StructuredListCell head>Line-up</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each data.songs as song, i}
			<StructuredListRow>
				<StructuredListCell>{song.name}</StructuredListCell>
				<StructuredListCell>{song.artist}</StructuredListCell>
				<StructuredListCell>
					<PlayLinkButton url={song.link} />
				</StructuredListCell>
				<StructuredListCell>
					{@const musicians = data.musiciansForSongs[song.id]}
					{#if musicians !== undefined}
						{#each musicians as musician, j}
							{musician.participantName} - {musician.instrumentName}
							<Button
								size="small"
								kind="ghost"
								class="removePerson"
								on:click={() => {
									selectedSong = i
									selectedUserId = musician.participantId
									selectedUserName = musician.participantName
									selectedInstrumentId = musician.instrumentId
									selectedUserEntry = j
									openDelUser = true
								}}
							>
								X
							</Button>
							<br />
						{/each}
					{/if}
				</StructuredListCell>
				<StructuredListCell>
					<Button
						kind="ghost"
						size="small"
						iconDescription="Add musician"
						icon={UserFollow}
						on:click={() => {
							selectedSong = i
							openAdd = true
						}}
					/>
					<Button
						kind="danger-tertiary"
						size="small"
						iconDescription="Delete"
						icon={MusicRemove}
						on:click={() => {
							selectedSong = i
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
	modalHeading="Delete from setlist"
	primaryButtonText="Delete"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDel}
	on:click:button--primary={() => {
		RemoveSongFromSetlist()
		openDel = false
	}}
	on:click:button--secondary={() => {
		openDel = false
	}}
>
	<p>Delete {data.songs[selectedSong]?.name}?</p>
</Modal>

<Modal
	danger
	modalHeading="Remove from song"
	primaryButtonText="Remove"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDelUser}
	on:click:button--primary={() => {
		RemoveParticipantFromSong()
		openDelUser = false
	}}
	on:click:button--secondary={() => {
		openDelUser = false
	}}
>
	<p>Remove {selectedUserName} from {data.songs[selectedSong]?.name}?</p>
</Modal>

<Modal
	bind:open={openAdd}
	modalHeading="Add participant to line-up"
	primaryButtonText="Confirm"
	on:click:button--primary={() => {
		AddParticipantToSong()
		openAdd = false
	}}
	hasScrollingContent
	class="addParticipantModal"
>
	<Form>
		<ComboBox
			titleText="Participant"
			bind:selectedId={participant}
			items={participantListItems}
			required
			shouldFilterItem={(item, value) => {
				if (!value) return true
				return item.text.toLowerCase().includes(value.toLowerCase())
			}}
		/>
		<br />
		<ComboBox 
			titleText="Instrument"
			bind:selectedId={instrument}
			items={instrumentListItems}
			required
			shouldFilterItem={(item, value) => {
				if (!value) return true
				return item.text.toLowerCase().includes(value.toLowerCase())
			}}
		/>
	</Form>
</Modal>

<style>
	:global(.removePerson) {
		color: red !important;
		min-height: 1rem !important;
		max-height: 1rem !important;
		padding: 0px !important;
		margin: 2px 0px !important;
		border: 0px;
	}

	:global(.addParticipantModal .bx--modal-content) {
		height: 25rem;
	}
</style>
