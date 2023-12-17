<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { db } from '$lib/firebase/client/firebase'
	import type { Song } from '$lib/types/domain/song'
	import type { User } from '$lib/types/domain/user'
	import {
		Modal,
		Form,
		TextInput,
		ComboBox,
		Grid,
		Row,
		Column,
		Button
	} from 'carbon-components-svelte'
	import type { DropdownItem } from 'carbon-components-svelte/types/Dropdown/Dropdown.svelte'
	import { AddAlt, CloseOutline } from 'carbon-icons-svelte'
	import {
		DocumentReference,
		addDoc,
		collection,
		deleteDoc,
		doc,
		getDocs,
		query,
		where,
		type DocumentData
	} from 'firebase/firestore'

	export let song: Song
	export let open = false

	export let users: User[]

	let participantListItems: DropdownItem[] = users.map(
		(user) => ({ id: user.id, text: user.name } as DropdownItem)
	)

	export let participants: {
		participantId: string | undefined
		instrument: string | undefined
	}[]

	let modalParticipants: {
		participantId: string | undefined
		instrument: string | undefined
	}[] = [...participants, { participantId: undefined, instrument: undefined }]

	/** Remove a participant from the song */
	async function removeParticipantFromSong(
		songRef: DocumentReference<DocumentData>,
		user: User,
		instrument: string
	) {
		// Get the document reference to the song the user plays on
		// const songRef = doc(db, 'songs', song.id)
		const playsInQuery = query(
			collection(db, 'users', user.id, 'playsSongs'),
			where('song', '==', songRef),
			where('part', '==', instrument)
		)
		const playsInDoc = (await getDocs(playsInQuery)).docs[0].ref

		// Delete the document
		await deleteDoc(playsInDoc)
	}

	/** Update the musicians for the song. */
	async function updateParticipantsOnSong() {
		const definedParticipants = modalParticipants.filter(
			({ participantId, instrument }) => participantId && instrument
		)
		const addedParticipants = definedParticipants.filter(
			({ participantId, instrument }) =>
				!participants.find((p) => p.participantId === participantId && p.instrument === instrument)
		)
		const deletedParticipants = participants.filter(
			({ participantId, instrument }) =>
				!definedParticipants.find(
					(p) => p.participantId === participantId && p.instrument === instrument
				)
		)

		const songRef = doc(db, 'songs', song.id)

		// Add all missing musicians to the song
		for (const { participantId, instrument } of addedParticipants) {
			await addDoc(collection(db, 'users/' + participantId + '/playsSongs'), {
				part: instrument,
				song: songRef
			})
		}

		// Remove all musicians that are not in the song anymore
		for (const { participantId, instrument } of deletedParticipants) {
			const user = users.find((u) => u.id === participantId)
			if (!user) console.error('User not found')
			else await removeParticipantFromSong(songRef, user, instrument!)
		}

		invalidateAll()
	}
</script>

<Modal
	modalHeading="Edit participant(s) on song"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	bind:open
	on:click:button--primary={() => {
		updateParticipantsOnSong()
		open = false
	}}
	on:click:button--secondary={() => {
		open = false
	}}
	primaryButtonDisabled={modalParticipants.some(
		({ participantId, instrument }) =>
			(participantId && !instrument) || (instrument && !participantId)
	)}
	hasScrollingContent
	class="editMusiciansOnSongModal"
>
	<Form>
		<Grid>
			{#each modalParticipants as participant, i}
				<Row>
					<Column sm={2} md={4} lg={7}>
						<ComboBox
							titleText="Participant"
							on:select={(e) => (participant.participantId = e.detail.selectedId ?? undefined)}
							selectedId={participant.participantId}
							items={participantListItems}
							required
							shouldFilterItem={(item, value) => {
								if (!value) return true
								return item.text.toLowerCase().includes(value.toLowerCase())
							}}
						/>
					</Column>
					<Column sm={2} md={3} lg={6}>
						<TextInput
							on:change={(e) =>
								(participant.instrument = e.detail ? e.detail.toString() : undefined)}
							value={participant.instrument}
							required
							labelText="Instrument"
						/>
					</Column>
					<Column sm={1} md={1} lg={1}>
						<Button
							class="remove-musician-button"
							icon={CloseOutline}
							iconDescription="Remove musician"
							kind="ghost"
							on:click={() => {
								modalParticipants = modalParticipants.filter((_, index) => index !== i)
							}}
						/>
					</Column>
				</Row>
			{/each}
		</Grid>
		<br />
		<Button
			icon={AddAlt}
			iconDescription="Add musician"
			kind="ghost"
			class="add-musician-button"
			on:click={() => {
				modalParticipants = [
					...modalParticipants,
					{
						participantId: undefined,
						instrument: undefined
					}
				]
			}}
		/>
	</Form>
</Modal>

<style>
	:global(.remove-musician-button) {
		margin-top: 1rem !important;
	}

	:global(.add-musician-button) {
		margin: 0 auto !important;
		display: block !important;
	}

	:global(.editMusiciansOnSongModal .bx--modal-content) {
		height: 30rem;
	}
</style>
