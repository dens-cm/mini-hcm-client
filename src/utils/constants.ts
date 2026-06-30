export const Role = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
} as const

export type RoleType = typeof Role[keyof typeof Role]
