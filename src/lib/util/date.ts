/** Create a new date on the given date, but with different hours and minutes */
export function newTimeOnDay(originalDate: Date, hours: number, minutes: number) {
	return new Date(
		originalDate.getFullYear(),
		originalDate.getMonth(),
		originalDate.getDate(),
		hours,
		minutes,
		originalDate.getSeconds(),
		originalDate.getMilliseconds()
	)
}
