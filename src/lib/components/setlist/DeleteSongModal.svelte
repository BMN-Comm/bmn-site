<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { getSuggestedSongs } from '$lib/firebase/client/firestore/songs'
	import { db } from '$lib/firebase/client/firebase'
	import { editionId } from '$lib/types/domain/edition'
	import type { Song } from '$lib/types/domain/song'
	import { MusicRemove } from 'carbon-icons-svelte'
	import { doc, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore'
	import CustomModal from '$lib/components/setlist/CustomModal.svelte'

	export let open = false
	export let onClose: () => void

	export let song: Song

	/** Remove the song from the setlist. If the song was not a suggestion, it gets deleted from the database altogether. */
	async function removeSongFromSetlist() {
		try {
			// Remove the song from the setlist
			const editionRef = doc(db, editionId)
			updateDoc(editionRef, {
				songs: arrayRemove(doc(db, 'songs', song.id))
			})

			// If the song was not a suggestion (but added directly to the setlist), delete it from the database completely
			if ((await getSuggestedSongs([song.id])).length === 0) {
				const songDoc = doc(db, 'songs', song.id)
				await deleteDoc(songDoc)
			}

			invalidateAll()
			return true
		} catch (error) {
			console.error(error) //TODO: handle error
			return false
		}
	}
</script>

<CustomModal
	modalHeading="Delete from setlist"
	primaryButtonText="Delete"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open
	{onClose}
	onSubmit={removeSongFromSetlist}
	danger
>
	<p>Delete {song.name}?</p>
</CustomModal>
