<script lang="ts">
	import { Button, DataTable } from 'carbon-components-svelte'
	import type { AuthUser } from '$lib/types/auth/authUser'
	import type { User } from '$lib/types/domain/user'
	import { TrashCan } from 'carbon-icons-svelte'

	export let data: { users: (User & { authUser: AuthUser })[] }
	const users = data.users

	/** Remove a user from the system. */
	async function DeleteUser(name: string, dbUid: string, authUid: string) {
		// Verify the user is sure of their action
		if (
			!window.confirm(`Are you sure you want to delete this user from the system forever: ${name}?`)
		)
			return

		const response = await fetch('/api/admin-portal/users', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ dbUid, authUid })
		})
		if (response.status === 200) window.location.reload()
		else {
			// TODO: Make something more visually pleasing
			alert(response.statusText)
		}
	}
</script>

<!-- Table containing all the users in the system -->
<DataTable
	headers={[
		{ key: 'name', value: 'Name' },
		{ key: 'email', value: 'Email' },
		{ key: 'uid', value: 'Delete' }
	]}
	rows={users}
>
	<svelte:fragment slot="cell" let:row let:cell>
		{#if cell.key === 'uid'}
			<Button
				kind="danger-tertiary"
				on:click={() => DeleteUser(row.name, row.id, row.authUser.uid)}
				icon={TrashCan}
			/>
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>

<a class="unstyled-link" href="/admin-portal/users/add">
	<Button>Add new user</Button>
</a>
