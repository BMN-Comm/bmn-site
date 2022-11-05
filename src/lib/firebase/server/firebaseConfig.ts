import type { ServiceAccount } from 'firebase-admin'

export const firebaseAdminConfig: ServiceAccount = {
	projectId: 'bmn-site-9c595',
	privateKey:
		process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? import.meta.env.VITE_FIREBASE_ADMIN_PRIVATE_KEY,
	clientEmail:
		process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? import.meta.env.VITE_FIREBASE_ADMIN_CLIENT_EMAIL
}
