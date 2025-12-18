export const queryKeys = {
  user: (userID: number) => ['user', userID] as const,
  users: () => ['users'] as const,

  packs: (userID: number) => ['packs', { userID }] as const,
  packDocuments: (userID: number, packID: number) => ['packDocuments', { userID, packID }] as const,

  notifications: (userID: number) => ['notifications', { userID }] as const,
} as const;
