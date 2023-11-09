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
	import { MusicAdd, MusicRemove, UserFollow } from 'carbon-icons-svelte'
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
	import { getSuggestedSongs } from '$lib/firebase/client/firestore/songs'
	import AddSongModal from '$lib/components/setlist/AddSongModal.svelte'

	export let data: PageData

	let selectedSong: number
	let selectedUserEntry: number
	let selectedUser: string
	let selectedInstrument: string

	let openDelSong = false
	let openDelMusician = false
	let openAddMusician = false
	let openAddSong = false

	let participantListItems: DropdownItem[] = data.users.map(
		(user) => ({ id: user.id, text: user.name } as DropdownItem)
	)

	let participant: string
	let instrument: string

	async function RemoveSongFromSetlist() {
		const selectedSongId = data.songs[selectedSong].id

		// Remove the song from the setlist
		const editionRef = doc(db, editionId)
		updateDoc(editionRef, {
			songs: arrayRemove(doc(db, 'songs', selectedSongId))
		})

		// If the song was not a suggestion (but added directly to the setlist), delete it from the database completely
		if ((await getSuggestedSongs([selectedSongId])).length === 0) {
			const suggestionDoc = doc(db, 'songs', selectedSongId)
			await deleteDoc(suggestionDoc)
		}

		invalidateAll()
	}

	async function AddParticipantToSong() {
		await addDoc(collection(db, 'users/' + participant + '/playsSongs'), {
			part: instrument,
			song: doc(db, 'songs', data.songs[selectedSong].id)
		})

		participant = ''
		instrument = ''

		invalidateAll()
	}

	async function RemoveParticipantFromSong() {
		const userQuery = query(collection(db, 'users'), where('name', '==', selectedUser))
		const userId = (await getDocs(userQuery)).docs[0].id
		const songRef = doc(db, 'songs', data.songs[selectedSong].id)

		const playsInQuery = query(
			collection(db, 'users', userId, 'playsSongs'),
			where('song', '==', songRef),
			where('part', '==', selectedInstrument)
		)
		const playsInDoc = (await getDocs(playsInQuery)).docs[0].ref

		await deleteDoc(playsInDoc)

		invalidateAll()
	}
</script>

<Grid>
	<Row>
		<Column><h1 class="titleText">Setlist</h1></Column>
		<Column>
			<Button
				class="alignRight"
				icon={MusicAdd}
				iconDescription={'Add song to setlist'}
				on:click={() => {
					openAddSong = true
				}}
			/>
		</Column>
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
									selectedUser = musician.participantName
									selectedInstrument = musician.instrumentName
									selectedUserEntry = j
									openDelMusician = true
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
							openAddMusician = true
						}}
					/>
					<Button
						kind="danger-tertiary"
						size="small"
						iconDescription="Delete"
						icon={MusicRemove}
						on:click={() => {
							selectedSong = i
							openDelSong = true
						}}
					/>
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</ScrollableList>
</Grid>

<AddSongModal bind:openAddSong />

<Modal
	danger
	modalHeading="Delete from setlist"
	primaryButtonText="Delete"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDelSong}
	on:click:button--primary={() => {
		RemoveSongFromSetlist()
		openDelSong = false
	}}
	on:click:button--secondary={() => {
		openDelSong = false
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
	bind:open={openDelMusician}
	on:click:button--primary={() => {
		RemoveParticipantFromSong()
		openDelMusician = false
	}}
	on:click:button--secondary={() => {
		openDelMusician = false
	}}
>
	<p>Remove {selectedUser} from {data.songs[selectedSong]?.name}?</p>
</Modal>

<Modal
	bind:open={openAddMusician}
	modalHeading="Add participant to line-up"
	primaryButtonText="Confirm"
	on:click:button--primary={() => {
		AddParticipantToSong()
		openAddMusician = false
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
		<TextInput bind:value={instrument} required labelText="Instrument" />
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
		height: 30rem;
	}

	:global(.alignRight) {
		float: right;
	}
</style>
