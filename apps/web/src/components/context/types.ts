// Context config
export type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
};

export type UserType = {
  email: string;
  noTelp?: string;
};

export interface UserContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}
