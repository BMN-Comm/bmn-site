/** https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript */
export function stringToColour(input: string) {
	let hash = 0
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash)
	}
	let colour = '#'
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff
		colour += ('00' + value.toString(16)).substr(-2)
	}
	return colour
}
