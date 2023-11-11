<script lang="ts">
	import { Modal } from 'carbon-components-svelte'

	export let open = false
	export let onClose: () => void
	export let onSubmit: () => Promise<boolean> // returns whether the function was executed successfully

	/** Closes the modal and waits a short time to call the onClose to account for the closing animation of the modal. */
	function closeModal() {
		open = false
		setTimeout(onClose, 250)
	}
</script>

<Modal
	{...$$props}
	on:click:button--primary={async () => {
		const success = await onSubmit()
		if (success) closeModal()
	}}
	on:click:button--secondary={() => {
		closeModal()
	}}
>
	<slot />
</Modal>
