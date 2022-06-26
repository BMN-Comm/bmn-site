<script lang="ts">
	import type { UserInfo } from 'firebase/auth'
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte'
	import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte'
	import { Button } from 'carbon-components-svelte'
	import { auth } from '../scripts/firebase/auth'

	export let user: UserInfo

	let expanded = false
</script>

<div
	class="toggle"
	on:click={() => {
		expanded = !expanded
	}}
>
	{user.email}
	{#if expanded}
		<ChevronUp />
	{:else}
		<ChevronDown />
	{/if}

	{#if expanded}
		<div class="signout-dropdown">
			<Button on:click={() => auth.signOut()}>Signout</Button>
		</div>
	{/if}
</div>

<style>
	.toggle {
		cursor: pointer;
	}

	.signout-dropdown {
		position: absolute;
		top: 48px;
		height: 30px;
	}
</style>
