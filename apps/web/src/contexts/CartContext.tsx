'use client';
import { toast } from 'react-toastify';
import { CartContextType, Cart } from './type';

import * as React from 'react';
import apiCall from '@/helper/apiCall';

export const CartContext = React.createContext<CartContextType>({
  cart: null,
  setCart: () => {},
  loading: true,
  setLoading: () => {},
});

interface ICartProviderProps {
  children: React.ReactNode;
}

const CartProvider: React.FunctionComponent<ICartProviderProps> = ({
  children,
}) => {
  const [cart, setCart] = React.useState<Cart | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const keepCart = async () => {
    try {
      const checkCart = localStorage.getItem('cart');
      if (checkCart) {
        const { data } = await apiCall.get(
          `/api/transaction/event?orderCode=${checkCart}`,
        );
        console.log(data);
        setCart({
          orderCode: data.result.orderCode,
          total: data.result.total,
          discountTotal: data.result.discountTotal,
          qty: data.result.qty,
          event: {
            title: data.result.event.title,
            price: data.result.event.price,
            images: [{ path: data.result.event.images[0].path }],
          },
        });
      }
    } catch (error) {
      console.log(error);
      toast('cannot get data');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const checkCart = sessionStorage.getItem('cart');
    if (checkCart) {
      keepCart();
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <CartContext.Provider value={{ cart, setCart, loading, setLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
