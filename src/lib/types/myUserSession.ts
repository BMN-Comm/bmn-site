import type { UserInfo } from 'firebase-admin/lib/auth/user-record'

export type MyUserInfo = UserInfo & {
	name: string
	databaseId: string
	admin: boolean
	commissie: boolean
}
