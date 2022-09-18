/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		userid: string
		decodedToken: DecodedIdToken | null
		session: { user: (UserSession & { admin: boolean; commissie: boolean }) | undefined }
	}
	// interface Platform {}

	// interface Stuff {}
}
