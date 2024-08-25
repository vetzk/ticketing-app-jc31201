export type UserType = {
  email: string;
  role: string;
  identificationId: string;
  points: number;
  image: string;
};

export interface UserContextType {
  user: UserType | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

export type Images = {
  path: string;
};

export type Category = {
  categoryName: string;
};
export type Location = {
  locationName: string;
};

export type Cart = {
  orderCode: string;
  total: number;
  discountTotal: number;
  qty: number;
  event: {
    title: string;
    price: number;
    images: {
      path: string;
    }[];
  };
};

export type Transaction = {
  event: {
    title: string;
    images: {
      path: string;
    }[];
  };
  userId: number;
  qty: number;
  discountId: number;
  orderCode: string;
  discountTotal: number;
  total: number;
  status: string;
};

export interface CartContextType {
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
