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
	import { AddAlt, CloseOutline, Edit } from 'carbon-icons-svelte'
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

	export let lineup: {
		participantId: string
		instrument: string
	}[]

	// The map ensures the type checker the participantIds can also be undefined
	$: bandcoachIds = lineup
		.filter((p) => p.instrument.toLowerCase() === 'bandcoach')
		.map((p) => p.participantId)

	$: modalBandcoachIds = [...bandcoachIds, undefined]

	// The map ensures the type checker understands the participantIds or instruments can also be undefined
	$: modalLineup = [
		...lineup
			.filter((p) => p.instrument.toLowerCase() !== 'bandcoach')
			.map((p) => ({
				participantId: p.participantId as string | undefined,
				instrument: p.instrument as string | undefined
			})),
		{ participantId: undefined, instrument: undefined }
	]

	$: notAllowedToSubmit = modalLineup.some(
		({ participantId, instrument }) =>
			(participantId && !instrument) || (instrument && !participantId) || instrument?.toLowerCase() === 'bandcoach'
	)

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

	/**
	 * Update the musicians for the song.
	 * @returns Whether the update was successful.
	 */
	async function updateParticipantsOnSong(): Promise<boolean> {
		// Check if the participants don't contain any bandcoaches
		if (modalLineup.some(({ instrument }) => instrument?.toLowerCase() === 'bandcoach')) {
			return false
		}

		// The map is to make sure the type checker understands the participantIds or instruments can not be undefined (because of the filter)
		const fullyFilledOutParticipants = modalLineup
			.filter(({ participantId, instrument }) => participantId && instrument)
			.map(({ participantId, instrument }) => ({
				participantId: participantId!,
				instrument: instrument!
			}))

		// Bandcoaches are optional
		const filledOutBandcoaches = modalBandcoachIds.filter((id) => !!id).map((id) => id!)
		if (filledOutBandcoaches.length > 0)
			fullyFilledOutParticipants.push(
				...filledOutBandcoaches.map((id) => {
					return { participantId: id, instrument: 'Bandcoach' }
				})
			)

		const addedParticipants = fullyFilledOutParticipants.filter(
			({ participantId, instrument }) =>
				!lineup.find((p) => p.participantId === participantId && p.instrument === instrument)
		)
		const deletedParticipants = lineup.filter(
			({ participantId, instrument }) =>
				!fullyFilledOutParticipants.find(
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

		return true
	}
</script>

<Modal
	modalHeading={`Edit line-up for ${song.name}`}
	primaryButtonIcon={Edit}
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	bind:open
	on:click:button--primary={async () => {
		const success = await updateParticipantsOnSong()
		open = !success
	}}
	on:click:button--secondary={() => {
		open = false
	}}
	on:close={() => {
		open = false
	}}
	primaryButtonDisabled={notAllowedToSubmit}
	hasScrollingContent
	hasForm
	class="editMusiciansOnSongModal"
>
	<Form>
		<Grid>
			{#each modalBandcoachIds as bandcoachId, i}
				<Row>
					<Column sm={3} md={7} lg={15}>
						<ComboBox
							titleText={`Bandcoach ${i + 1}`}
							on:select={(e) => (bandcoachId = e.detail.selectedId)}
							on:clear={() => (bandcoachId = undefined)}
							selectedId={bandcoachId}
							items={participantListItems}
							shouldFilterItem={(item, value) => {
								if (!value) return true
								return item.text.toLowerCase().includes(value.toLowerCase())
							}}
						/>
					</Column>
					<Column sm={1} md={1} lg={1}>
						<Button
							class="remove-musician-button"
							icon={CloseOutline}
							iconDescription="Remove bandcoach"
							tooltipAlignment='end'
							kind="danger-ghost"
							on:click={() => {
								modalBandcoachIds = modalBandcoachIds.filter((_, index) => index !== i)
							}}
						/>
					</Column>
				</Row>
			{/each}
		</Grid>
		<br />
		<Button
			icon={AddAlt}
			iconDescription="Add bandcoach"
			kind="ghost"
			class="add-musician-button"
			on:click={() => {
				modalBandcoachIds = [...modalBandcoachIds, undefined]
			}}
		/>
		<br />

		<Grid>
			{#each modalLineup as participant, i}
				<Row>
					<Column sm={2} md={4} lg={8}>
						<ComboBox
							titleText="Participant"
							on:select={(e) => (participant.participantId = e.detail.selectedId ?? undefined)}
							on:clear={() => (participant.participantId = undefined)}
							selectedId={participant.participantId}
							items={participantListItems}
							required
							shouldFilterItem={(item, value) => {
								if (!value) return true
								return item.text.toLowerCase().includes(value.toLowerCase())
							}}
						/>
					</Column>
					<Column sm={1} md={3} lg={7}>
						<TextInput
							on:change={(e) =>
								(participant.instrument = e.detail ? e.detail.toString() : undefined)}
							value={participant.instrument}
							invalid={participant.instrument?.toLowerCase() === 'bandcoach'}
							invalidText="Please fill in bandcoaches at the top"
							required
							labelText="Instrument"
						/>
					</Column>
					<Column sm={1} md={1} lg={1}>
						<Button
							class="remove-musician-button"
							icon={CloseOutline}
							iconDescription="Remove musician"
							tooltipAlignment='end'
							kind="danger-ghost"
							on:click={() => {
								modalLineup = modalLineup.filter((_, index) => index !== i)
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
				modalLineup = [
					...modalLineup,
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

	:global(.row-with-bottom-padding) {
		padding-bottom: 1rem;
	}
</style>
