<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import CustomModal from '$lib/components/setlist/CustomModal.svelte'
	import { db } from '$lib/firebase/client/firebase'
	import type { Song } from '$lib/types/domain/song'
	import type { User } from '$lib/types/domain/user'
	import { MusicRemove } from 'carbon-icons-svelte'
	import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'

	export let open = false
	export let onClose: () => void

	export let song: Song
	export let user: User
	export let instrument: string

	async function removeParticipantFromSong() {
		try {
			// Get the document reference to the song the user plays on
			const songRef = doc(db, 'songs', song.id)
			const playsInQuery = query(
				collection(db, 'users', user.id, 'playsSongs'),
				where('song', '==', songRef),
				where('part', '==', instrument)
			)
			const playsInDoc = (await getDocs(playsInQuery)).docs[0].ref

			// Delete the document
			await deleteDoc(playsInDoc)

			invalidateAll()
			return true
		} catch (error) {
			console.error(error) //TODO: handle error
			return false
		}
	}
</script>

<CustomModal
	modalHeading="Remove from song"
	primaryButtonText="Remove"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open
	{onClose}
	onSubmit={removeParticipantFromSong}
	danger
>
	<p>Remove {user.name} from {song.name}?</p>
</CustomModal>
