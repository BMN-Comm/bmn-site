import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import authStore from './authStore'

const firebaseConfig = {
	apiKey: 'AIzaSyA4X7YCT7m7hFTyLJSPcEc_nZJOQ-9CTyE',
	authDomain: 'bmn-site-9c595.firebaseapp.com',
	projectId: 'bmn-site-9c595',
	storageBucket: 'bmn-site-9c595.appspot.com',
	messagingSenderId: '511143035115',
	appId: '1:511143035115:web:fe89ed421433de6e69feae'
}

const app = initializeApp(firebaseConfig)

getAuth(app).onAuthStateChanged((user) => {
	authStore.set({
		isLoggedIn: user !== null,
		user: user ?? undefined,
		firebaseControlled: true
	})
})

export default app
