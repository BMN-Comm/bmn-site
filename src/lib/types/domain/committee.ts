export type committee = {
	year: number
	likesSongs: string[] // List of references to song
	usersInCommittee: {
		user: string // reference to user
		role: string
	}[]
}
