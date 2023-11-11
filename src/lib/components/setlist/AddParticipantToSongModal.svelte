<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import CustomModal from '$lib/components/setlist/CustomModal.svelte'
	import { db } from '$lib/firebase/client/firebase'
	import type { Song } from '$lib/types/domain/song'
	import type { user } from '$lib/types/domain/user'
	import { Form, ComboBox, TextInput } from 'carbon-components-svelte'
	import type { DropdownItem } from 'carbon-components-svelte/types/Dropdown/Dropdown.svelte'
	import { addDoc, collection, doc } from 'firebase/firestore'

	export let open = false
	export let onClose: () => void

	export let song: Song
	export let users: user[]

	let userId: string
	let instrument: string

	let participantListItems: DropdownItem[] = users.map(
		(user) => ({ id: user.id, text: user.name } as DropdownItem)
	)

	async function addParticipantToSong() {
		try {
			// Add the song to the songs a user plays on
			await addDoc(collection(db, 'users/' + userId + '/playsSongs'), {
				song: doc(db, 'songs', song.id),
				part: instrument
			})

			// Reset state
			userId = ''
			instrument = ''

			invalidateAll()
			return true
		} catch (error) {
			console.error(error) //TODO: handle error
			return false
		}
	}
</script>

<CustomModal
	modalHeading="Add participant to line-up"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	bind:open
	{onClose}
	onSubmit={addParticipantToSong}
	hasScrollingContent
	hasForm
	selectorPrimaryFocus="#participant"
	class="addParticipantModal"
>
	<Form>
		<ComboBox
			id="participant"
			titleText="Participant"
			placeholder="Participant"
			bind:selectedId={userId}
			items={participantListItems}
			required
			shouldFilterItem={(item, value) => {
				if (!value) return true
				return item.text.toLowerCase().includes(value.toLowerCase())
			}}
		/>
		<br />
		<TextInput
			id="instrument"
			labelText="Instrument"
			placeholder="Instrument"
			bind:value={instrument}
			required
		/>
	</Form>
</CustomModal>

<style>
	:global(.addParticipantModal .bx--modal-content) {
		height: 20rem;
	}
</style>
