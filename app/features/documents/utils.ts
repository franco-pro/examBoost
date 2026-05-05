import { useMemo } from 'react';

export type DocumentRow = {
  id: number;
  name: string; // matière
  format: string | null;
  url: string;
  subject: string; // épreuve
  isValidated: 0 | 1;
  niveauID: number;
  created_at: string;
  updated_at: string;
  type?: string;
  correctionId?: string
};

// Temporaire: dataset mock aligné avec l'exemple fourni
export const MOCK_DOCUMENTS: DocumentRow[] = [
  {
    id: 1,
    name: 'Mathématiques',
    format: 'pdf',
    url: 'https://www.africau.edu/images/default/sample.pdf',
    subject: 'Evaluation1',
    isValidated: 1,
    niveauID: 3,
    created_at: '2025-09-19 10:14:24',
    updated_at: '2025-09-19 10:14:24',
  },
  {
    id: 2,
    name: 'Informatique',
    format: 'pdf',
    url: 'uploads/documents/1758484081164_rq1z16.pdf',
    subject: 'Programmation',
    isValidated: 0,
    niveauID: 3,
    created_at: '2025-09-21 19:48:01',
    updated_at: '2025-09-21 19:48:01',
  },
  {
    id: 5,
    name: 'Anglais',
    format: 'pdf',
    url: 'uploads/documents/1758490369031_yvx57i.pdf',
    subject: 'Test',
    isValidated: 0,
    niveauID: 3,
    created_at: '2025-09-21 21:32:53',
    updated_at: '2025-09-21 21:32:53',
  },
];

export function groupByName(docs: DocumentRow[]) {
  const map = new Map<string, { count: number; subjects: string[]; niveaux: number[] }>();
  for (const d of docs) {
    const entry = map.get(d.name) ?? { count: 0, subjects: [], niveaux: [] };
    entry.count += 1;
    if (!entry.subjects.includes(d.subject)) entry.subjects.push(d.subject);
    if (!entry.niveaux.includes(d.niveauID)) entry.niveaux.push(d.niveauID);
    map.set(d.name, entry);
  }
  return Array.from(map.entries()).map(([name, v]) => ({ name, ...v }));
}

export function getDistinct<T extends keyof DocumentRow>(docs: DocumentRow[], key: T): DocumentRow[T][] {
  const s = new Set<DocumentRow[T]>();
  for (const d of docs) s.add(d[key]);
  return Array.from(s);
}

export type FilterParams = {
  type: string; // matière
  subject?: string;
  niveauID?: number;

};

export function filterDocuments(docs: DocumentRow[], params: FilterParams) {
  const { type, subject, niveauID } = params;
  return docs.filter((d) =>
    d.type === type && (subject ? d.subject === subject : true) && (niveauID ? d.niveauID === niveauID : true)
  );
}

export function useGroupedSubjects(docs: DocumentRow[]) {
  return useMemo(() => groupByName(docs), [docs]);
}
