import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth'
import App from './app'

const createAuth = () => {
	const auth = getAuth(App)
	async function signIn(email: string, password: string) {
		await signInWithEmailAndPassword(auth, email, password)
	}

	async function signOut() {
		await fbSignOut(auth)
	}

	return {
		signIn,
		signOut
	}
}

export const auth = createAuth()
