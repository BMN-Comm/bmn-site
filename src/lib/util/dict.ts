export function toDict<T>(
	data: (
		| {
				[x: string]: T
		  }
		| undefined
	)[]
) {
	return Object.assign({}, ...data) as { [x: string]: T }
}
