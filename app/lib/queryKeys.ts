export const queryKeys = {
  user: (userID: number) => ['user', userID] as const,
  users: () => ['users'] as const,

  packs: (userID: number) => ['packs', { userID }] as const,
  packDocuments: (userID: number) => ['packDocuments', { userID }] as const,
  Documents: (documentId: number) => ['documents', { documentId }] as const,

  notifications: (userID: number) => ['notifications', { userID }] as const,
} as const;
