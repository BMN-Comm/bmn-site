import type { ServiceAccount } from 'firebase-admin'

export const firebaseAdminConfig: ServiceAccount = {
	projectId: 'bmn-site-9c595',
	privateKey: import.meta.env.VITE_FIREBASE_ADMIN_PRIVATE_KEY,
	clientEmail: import.meta.env.VITE_FIREBASE_ADMIN_CLIENT_EMAIL
}
