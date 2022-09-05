import type { UserInfo } from 'firebase-admin/lib/auth/user-record'

export type MyUserInfo = UserInfo & { admin: boolean; commissie: boolean }
