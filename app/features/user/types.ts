export type User = {
  id: number;
  username: string;
  surname: string;
  email: string;
  wallet: number;
  role: string;
  phone: string;
  imgUrl: string | null;
  isActivated: 0 | 1 | boolean;
  niveauID: number;
  created_at?: string;
  updated_at?: string;
};
