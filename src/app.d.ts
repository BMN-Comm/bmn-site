/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		userid: string
		decodedToken: DecodedIdToken | null
	}
	// interface Platform {}

	interface Session {
		user: UserSession | undefined
	}

	// interface Stuff {}
}
