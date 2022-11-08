import { PUBLIC_FIREBASE_CLIENT_API_KEY } from '$env/static/public'

export const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_CLIENT_API_KEY ?? process.env.PUBLIC_FIREBASE_CLIENT_API_KEY,
	authDomain: 'bmn-site-9c595.firebaseapp.com',
	projectId: 'bmn-site-9c595',
	storageBucket: 'bmn-site-9c595.appspot.com',
	messagingSenderId: '511143035115',
	appId: '1:511143035115:web:fe89ed421433de6e69feae'
}
