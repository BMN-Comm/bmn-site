import { writable } from 'svelte/store'
import type { UserInfo } from 'firebase/auth'

// Store used to access the current state of authentication across the app.
const authStore = writable<{
	isLoaded: boolean
	isLoggedIn: boolean
	user?: UserInfo
	firebaseControlled: boolean
}>({
	isLoaded: false,
	isLoggedIn: false,
	firebaseControlled: false
})

export default {
	subscribe: authStore.subscribe,
	set: authStore.set
}
