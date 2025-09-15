import * as functions from 'firebase-functions/v1'
import { logger } from 'firebase-functions'

let ssrServerServer: any
exports.ssrServer = functions
	.runWith({
		secrets: ['VITE_FIREBASE_ADMIN_PRIVATE_KEY', 'VITE_FIREBASE_ADMIN_CLIENT_EMAIL']
	})
	.https.onRequest(async (request, response) => {
		if (!ssrServerServer) {
			logger.info('Initialising SvelteKit SSR entry')
			ssrServerServer = require('./ssrServer/index').default
			logger.info('SvelteKit SSR entry initialised!')
		}
		logger.info('Requested resource: ' + request.originalUrl)
		return ssrServerServer(request, response)
	})
