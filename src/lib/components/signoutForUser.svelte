<script lang="ts">
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte'
	import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte'
	import { Button } from 'carbon-components-svelte'
	import { auth } from '$lib/firebase/client/firebase'
	import type { MyUserInfo } from '$lib/types/myUserSession'

	export let user: MyUserInfo | undefined

	let expanded = false
</script>

<div
	class="toggle"
	on:click={() => {
		expanded = !expanded
	}}
	on:keyup={() => {
		expanded = !expanded
	}}
>
	<span class="email-span">{user?.name ?? user?.email}</span>

	{#if expanded}
		<ChevronUp />
	{:else}
		<ChevronDown />
	{/if}

	{#if expanded}
		<div class="signout-dropdown">
			<Button class="signout-button" on:click={() => auth.signOut()}>Signout</Button>
		</div>
	{/if}
</div>

<style>
	.email-span {
		margin-right: 5px;
		padding-left: 15px;
	}

	.toggle {
		cursor: pointer;
		padding-left: 15px;
		padding-right: 15px;
	}

	.signout-dropdown {
		position: absolute;
		top: 48px;
		width: 100%;
		height: 30px;
	}

	.signout-dropdown > :global(.signout-button) {
		width: 100%;
	}
</style>
