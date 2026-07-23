export type User = {
  id: number;
  username: string;
  surname: string;
  email: string;
  wallet: number;
  role: string;
  phone: string;
  canSubmitDoc: boolean;
  imgUrl: any;
  isActivated: 0 | 1 | boolean;
  niveauID: number;
  created_at?: string;
  updated_at?: string;
};
