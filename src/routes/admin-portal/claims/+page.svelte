<script lang="ts" context="module">
	import Add from 'carbon-icons-svelte/lib/Add.svelte'
</script>

<script lang="ts">
	import { Button, DataTable, TextInput, Tooltip, TooltipFooter } from 'carbon-components-svelte'

	export let data: { users: any[] }
	const users = data.users

	// Single value to store input for any claim textInput, since its not really a problem if the value persists between buttons
	let claimValue: string

	/** Set the claim currently in the claimValue as a claim of the given user */
	async function SetClaimFor(id: string) {
		// Verify the user is sure of their action
		if (!window.confirm(`Are you sure you want to add the following claim: ${claimValue}`)) return

		await SendClaimRequest({ id, claim: claimValue }, 'POST')
	}

	/** Remove the given claim from the given user */
	async function DeleteClaimFor(id: string, claim: string) {
		// Verify the user is sure of their action
		if (!window.confirm(`Are you sure you want to remove the following claim: ${claim}`)) return

		await SendClaimRequest({ id, claim }, 'DELETE')
	}

	/** Create a request to add or delete claims, send it, and reload if it succeeds. */
	async function SendClaimRequest(data: { id: string; claim: string }, method: 'POST' | 'DELETE') {
		const response = await fetch('/api/admin-portal/claims', {
			method,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		if (response.status === 200) window.location.reload()
		else {
			// TODO: Make something more visually pleasing
			alert(response.statusText)
		}
	}
</script>

<!-- Table containing all the users in the system as well as their claims  -->
<DataTable
	headers={[
		{ key: 'email', value: 'Email' },
		{ key: 'customClaims', value: 'Custom Claims' },
		{ key: 'id', value: 'Add Claims' }
	]}
	rows={users}
>
	<svelte:fragment slot="cell" let:row let:cell>
		{#if cell.key === 'customClaims'}
			{#each Object.keys(row.customClaims ?? {}) as claim}
				<Tooltip hideIcon triggerText={claim}>
					<Button on:click={() => DeleteClaimFor(row.id, claim)} size="small">Delete</Button>
				</Tooltip>
			{/each}
		{:else if cell.key === 'id'}
			<Tooltip icon={Add}>
				<TextInput bind:value={claimValue} placeholder="enter claim" />
				<TooltipFooter>
					<Button on:click={() => SetClaimFor(row.id)} size="small">Add</Button>
				</TooltipFooter>
			</Tooltip>
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>
