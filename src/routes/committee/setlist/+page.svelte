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
		arrayUnion,
		collection,
		deleteDoc,
		doc,
		getDocs,
		query,
		setDoc,
		updateDoc,
		where
	} from 'firebase/firestore'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import { editionId } from '$lib/types/domain/edition'
	import { isValidUrl } from '$lib/util/urlValidation'

	export let data: PageData

	let selectedSong: number
	let selectedUserEntry: number
	let selectedUser: string
	let selectedInstrument: string

	let addSongName: string
	let addSongArtist: string
	let addSongLink: string
	$: validLink = true
	let addSongLength: string

	let openDelSong = false
	let openDelMusician = false
	let openAddMusician = false
	let openAddSong = false

	let participantListItems: DropdownItem[] = data.users.map(
		(user) => ({ id: user.id, text: user.name } as DropdownItem)
	)

	let participant: string
	let instrument: string

	async function CreateAndAddSongToSetlist() {
		// TODO: Show error if failed
		if (!isValidUrl(addSongLink)) {
			console.log('invalid')
			validLink = false
			return
		}

		let song = {
			name: addSongName,
			artist: addSongArtist,
			length: addSongLength,
			link: addSongLink
		}

		const newSong = doc(collection(db, 'songs'))

		await setDoc(newSong, song)

		// Add the song to the setlist
		const editionRef = doc(db, editionId)
		updateDoc(editionRef, {
			songs: arrayUnion(doc(db, 'songs', newSong.id))
		})

		addSongName = ''
		addSongArtist = ''
		addSongLink = ''
		addSongLength = ''
		validLink = true

		invalidateAll()
	}

	async function RemoveSongFromSetlist() {
		const editionRef = doc(db, editionId)
		updateDoc(editionRef, {
			songs: arrayRemove(doc(db, 'songs', data.songs[selectedSong].id))
		})
		invalidateAll()
	}

	async function AddParticipantToSong() {
		await addDoc(collection(db, 'users/' + participant + '/playsSongs'), {
			part: instrument,
			song: doc(db, 'songs', data.songs[selectedSong].id)
		})

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
				iconDescription={"Add song to setlist"}
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

<Modal
	modalHeading="Add to setlist"
	bind:open={openAddSong}
	primaryButtonText="Add"
	primaryButtonIcon={MusicAdd}
	secondaryButtonText="Cancel"
	hasForm
	selectorPrimaryFocus="#name"
	on:click:button--primary={async () => {
		await CreateAndAddSongToSetlist()
		openAddSong = false
	}}
	on:click:button--secondary={() => {
		openAddSong = false
	}}
>
	<Form>
		<Grid>
			<Row padding>
				<Column>
					<TextInput
						id="name"
						labelText="Name"
						placeholder="Name"
						bind:value={addSongName}
						required
					/>
				</Column>
			</Row>
			<Row padding>
				<Column>
					<TextInput
						id="artist"
						labelText="Artist"
						placeholder="Artist"
						bind:value={addSongArtist}
						required
					/>
				</Column>
			</Row>
			<Row padding>
				<Column sm={4} md={4} lg={10}>
					<TextInput
					id="link"
					labelText="Link"
					placeholder="Link"
					bind:value={addSongLink}
					invalid={!validLink}
					invalidText={validLink ? undefined : 'Enter a valid link'}
				/>
				</Column>
				<Column sm={4} md={4} lg={6}>
					<TextInput
						id="length"
						labelText="Length (mm:ss)*"
						placeholder="Enter the length of the song"
						bind:value={addSongLength}
						pattern="[0-9][0-9]:[0-9][0-9]"
					/>
				</Column>
			</Row>
		</Grid>
	</Form>
</Modal>

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
