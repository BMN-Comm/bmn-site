<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit'
	import Add from 'carbon-icons-svelte/lib/Add.svelte'

	export const load: Load = async function ({ fetch }) {
		const response = await (await fetch('api/admin-portal/users')).json()

		return {
			status: 200,
			props: {
				users: response
			}
		}
	}
</script>

<script lang="ts">
	import { Button, DataTable, TextInput, Tooltip, TooltipFooter } from 'carbon-components-svelte'

	export let users: any[]

	// Carbon table wants ids for every user
	let usersWithId = users.map((user) => {
		user.id = user.uid
		return user
	})

	// Single value to store input for any claim textInput, since its not really a problem if the value persists between buttons
	let claimValue: string

	/** Set the claim currently in the claimValue as a claim of the given user */
	async function SetClaimFor(uid: string) {
		// Verify the user is sure of their action
		if (!window.confirm(`Are you sure you want to add the following claim: ${claimValue}`)) return

		await SendClaimRequest({ uid, claim: claimValue }, 'POST')
	}

	/** Remove the given claim from the given user */
	async function DeleteClaimFor(uid: string, claim: string) {
		// Verify the user is sure of their action
		if (!window.confirm(`Are you sure you want to remove the following claim: ${claim}`)) return

		await SendClaimRequest({ uid, claim }, 'DELETE')
	}

	/** Create a request to add or delete claims, send it, and reload if it succeeds. */
	async function SendClaimRequest(data: { uid: string; claim: string }, method: 'POST' | 'DELETE') {
		const response = await fetch('api/admin-portal/claims', {
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
		{ key: 'uid', value: 'Add Claims' }
	]}
	rows={usersWithId}
>
	<svelte:fragment slot="cell" let:row let:cell>
		{#if cell.key === 'customClaims'}
			{#each Object.keys(row.customClaims ?? {}) as claim}
				<Tooltip hideIcon triggerText={claim}>
					<Button on:click={() => DeleteClaimFor(row.uid, claim)} size="small">Delete</Button>
				</Tooltip>
			{/each}
		{:else if cell.key === 'uid'}
			<Tooltip icon={Add}>
				<TextInput bind:value={claimValue} placeholder="enter claim" />
				<TooltipFooter>
					<Button on:click={() => SetClaimFor(row.uid)} size="small">Add</Button>
				</TooltipFooter>
			</Tooltip>
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>
