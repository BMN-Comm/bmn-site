import type { rehearsal } from '$lib/types/domain/rehearsal'
import type { announcement } from '$lib/types/domain/announcement'
import { PUBLIC_DISCORD_WEBHOOK_URL } from '$env/static/public'

const colours: string[] = ['00b380', '800020', '696969']

export async function newRehearsalPost(rehearsal: rehearsal) {
	const params = {
		username: 'New Rehearsal!',
		avatar_url:
			'https://cdn.discordapp.com/icons/500419426974302220/b327ff9416c28ac51909aed76c2ac614.webp?size=480',
		embeds: [
			{
				author: {
					name: 'BMN Notifier',
					icon_url:
						'https://cdn.discordapp.com/icons/500419426974302220/b327ff9416c28ac51909aed76c2ac614.webp?size=480'
				},
				title: 'New Rehearsal!',
				url: 'http://betamusicnight.nl/participant/availability/' + rehearsal.id,
				description: 'New Rehearsal on ' + rehearsal.startTime.toDate().toDateString(),
				fields: [
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
				],
				footer: {
					text: 'Fill in your availability by clicking the post title!'
				},
				timestamp: new Date().toISOString(),
				color: hexToDecimal(colours[Math.floor(Math.random() * colours.length)])
			}
		]
	}

	return sendWebhookMessage(params)
}

export async function newNewsPost(announcement: announcement) {
	const params = {
		username: 'New Announcement!',
		avatar_url:
			'https://cdn.discordapp.com/icons/500419426974302220/b327ff9416c28ac51909aed76c2ac614.webp?size=480',
		embeds: [
			{
				author: {
					name: 'BMN Notifier',
					icon_url:
						'https://cdn.discordapp.com/icons/500419426974302220/b327ff9416c28ac51909aed76c2ac614.webp?size=480'
				},
				title: 'New Announcement!',
				url: 'http://betamusicnight.nl/participant/announcements',
				footer: {
					text: 'Go read the announcement by clicking the post title!'
				},
				timestamp: new Date().toISOString(),
				color: hexToDecimal(colours[Math.floor(Math.random() * colours.length)])
			}
		]
	}

	return sendWebhookMessage(params)
}

export async function newSchedule(rehearsal: rehearsal) {
	const params = {
		username: 'Schedule Live!',
		avatar_url:
			'https://cdn.discordapp.com/icons/500419426974302220/b327ff9416c28ac51909aed76c2ac614.webp?size=480',
		embeds: [
			{
				author: {
					name: 'BMN Notifier',
					icon_url:
						'https://cdn.discordapp.com/icons/500419426974302220/b327ff9416c28ac51909aed76c2ac614.webp?size=480'
				},
				title: 'Schedule Live!',
				url: 'http://betamusicnight.nl/participant/rehearsal/' + rehearsal.id,
				description: 'For rehearsal on ' + rehearsal.startTime.toDate().toDateString(),
				fields: [
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
				],
				footer: {
					text: 'Check the schedule by clicking the post title!'
				},
				timestamp: new Date().toISOString(),
				color: hexToDecimal(colours[Math.floor(Math.random() * colours.length)])
			}
		]
	}

	return sendWebhookMessage(params)
}

function hexToDecimal(hex: string) {
	return parseInt(hex, 16)
}

async function sendWebhookMessage(params: any) {
	const response = await fetch(PUBLIC_DISCORD_WEBHOOK_URL, {
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
