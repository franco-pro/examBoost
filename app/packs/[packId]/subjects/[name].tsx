
import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';

export default function RedirectOldSubjectName() {
  const { packId, name, niveauID, subject } = useLocalSearchParams<{
    packId: string;
    name: string;
    niveauID?: string;
    subject?: string;
  }>();

  return (
    <Redirect
      href={{
        pathname: '/(tabs)/packs/[packId]/subjects/[name]',
        params: {
          packId: String(packId),
          name: String(name),
          ...(niveauID ? { niveauID: String(niveauID) } : {}),
          ...(subject ? { subject: String(subject) } : {}),
        },
      } as any}
    />
  );
}
