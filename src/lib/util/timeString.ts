import type { Timestamp } from 'firebase/firestore'

export function getTimeString(time: Timestamp) {
	const date = time.toDate()
	return date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0')
}
