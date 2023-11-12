import type { RehearsalInfo, Rehearsal } from '$lib/types/domain/rehearsal'
import type { NewAnnouncement } from '$lib/types/domain/announcement'
import { PUBLIC_DISCORD_WEBHOOK_URL } from '$env/static/public'

const colours: string[] = ['00b380', '800020', '696969']

// TODO: Send on server
export async function newRehearsalPost(rehearsalId: string, rehearsal: RehearsalInfo) {
	const params = createWebhookMessage(
		'New Rehearsal!',
		'http://betamusicnight.nl/participant/availability/' + rehearsalId,
		'Fill in your availability by clicking the post title!',
		'New Rehearsal on ' + rehearsal.startTime.toDate().toDateString(),
		[
			{
				name: 'From:',
				value:
					rehearsal.startTime.toDate().getHours() +
					':' +
					String(rehearsal.startTime.toDate().getMinutes()).padStart(2, '0'),
				inline: true
			},
			{
				name: 'To:',
				value:
					rehearsal.endTime.toDate().getHours() +
					':' +
					String(rehearsal.endTime.toDate().getMinutes()).padStart(2, '0'),
				inline: true
			},
			{
				name: 'At:',
				value: rehearsal.location,
				inline: true
			}
		]
	)

	return sendWebhookMessage(params)
}

export async function newNewsPost(announcement: NewAnnouncement) {
	const params = createWebhookMessage(
		'New Announcement! - ' + announcement.title,
		'http://betamusicnight.nl/participant/announcements',
		'Go read the announcement by clicking the post title!'
	)

	return sendWebhookMessage(params)
}

export async function newSchedule(rehearsal: Rehearsal) {
	const params = createWebhookMessage(
		'Schedule Live!',
		`http://betamusicnight.nl/participant/rehearsals/${rehearsal.id}/schedule`,
		'Check the schedule by clicking the post title!',
		'For rehearsal on ' + rehearsal.startTime.toDate().toDateString(),
		[
			{
				name: 'From:',
				value:
					rehearsal.startTime.toDate().getHours() +
					':' +
					String(rehearsal.startTime.toDate().getMinutes()).padStart(2, '0'),
				inline: true
			},
			{
				name: 'To:',
				value:
					rehearsal.endTime.toDate().getHours() +
					':' +
					String(rehearsal.endTime.toDate().getMinutes()).padStart(2, '0'),
				inline: true
			},
			{
				name: 'At:',
				value: rehearsal.location,
				inline: true
			}
		]
	)

	return sendWebhookMessage(params)
}

function hexToDecimal(hex: string) {
	return parseInt(hex, 16)
}

function createWebhookMessage(
	name: string,
	url: string,
	footer: string,
	description?: string,
	fields?: { name: string; value: string; inline: boolean }[]
) {
	return {
		username: name,
		avatar_url:
			'https://cdn.discordapp.com/icons/500419426974302220/b327ff9416c28ac51909aed76c2ac614.webp?size=480',
		embeds: [
			{
				author: {
					name: 'BMN Notifier',
					icon_url:
						'https://cdn.discordapp.com/icons/500419426974302220/b327ff9416c28ac51909aed76c2ac614.webp?size=480'
				},
				title: name,
				url: url,
				description: description,
				fields: fields,
				footer: {
					text: footer
				},
				timestamp: new Date().toISOString(),
				color: hexToDecimal(colours[Math.floor(Math.random() * colours.length)])
			}
		]
	}
}

async function sendWebhookMessage(params: {
	username: string
	avatar_url: string
	embeds: Record<string, unknown>[]
}) {
	await fetch(PUBLIC_DISCORD_WEBHOOK_URL, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(params)
	})
}
