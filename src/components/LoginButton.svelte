<script lang="ts">
	import {
		Button,
		FluidForm,
		InlineLoading,
		InlineNotification,
		Modal,
		PasswordInput,
		TextInput
	} from 'carbon-components-svelte'
	import type { UserInfo } from 'firebase/auth'
	import authStore from '../scripts/firebase/authStore'
	import { auth } from '../scripts/firebase/auth'
	import SignoutForUser from './SignoutForUser.svelte'

	let modalOpen = false
	let loginError = false

	let email: string
	let password: string

	let loggedIn = false
	let currentUser: UserInfo
	let loading = true

	/** Login using the email and password provided by the user*/
	function LoginWithEmailAndPassword() {
		auth.signIn(email, password)
		modalOpen = false
	}

	// Make sure the login component knows if the user is logged in or not.
	authStore.subscribe(async ({ isLoggedIn, user }) => {
		loggedIn = isLoggedIn
		if (user) currentUser = user
		loading = false
	})
</script>

<div class="login-wrapper">
	{#if loading}
		<InlineLoading />
	{:else if loggedIn}
		<SignoutForUser user={currentUser} />
	{:else}
		<Button on:click={() => (modalOpen = true)}>Login</Button>
	{/if}
</div>

<Modal
	bind:open={modalOpen}
	modalHeading="Login"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	on:click:button--primary={LoginWithEmailAndPassword}
>
	<FluidForm>
		<TextInput bind:value={email} required type="email" labelText="Email" />
		<PasswordInput
			bind:value={password}
			required
			type="password"
			labelText="Password"
			tooltipPosition="left"
		/>
	</FluidForm>
	{#if loginError}
		<InlineNotification
			subtitle="De combinatie van email en wachtwoord klopt niet."
			on:close={() => (loginError = false)}
		/>
	{/if}
</Modal>

<style>
	.login-wrapper {
		margin-left: auto;
	}
</style>
