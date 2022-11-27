/** Check whether a given string is a valid url format */
export function isValidUrl(urlString: string) {
	const urlPattern = new RegExp(
		'^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)$',
		'i'
	) // validate fragment locator
	return !!urlPattern.test(urlString)
}
