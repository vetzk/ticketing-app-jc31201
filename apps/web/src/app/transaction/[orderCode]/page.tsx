'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiCall from '@/helper/apiCall';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useContext } from 'react';
import Image from 'next/image';
import { CartContext } from '../../../contexts/CartContext';
import { UserContext } from '@/contexts/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '@/components/Loading';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import withRole from '@/hoc/roleGuard';

type Ticket = {
  orderCode: string;
  event: {
    images: {
      path: string;
    }[];
  };
};

interface ICheckoutProps {
  params: {
    orderCode: string;
  };
}

const Checkout: React.FunctionComponent<ICheckoutProps> = ({ params }) => {
  const [discount, setDiscount] = React.useState<string>('');

  const { cart, setCart } = React.useContext(CartContext);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');
  const router = useRouter();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['transaction'],
    queryFn: async () => {
      const { data } = await apiCall.get(
        `/api/transaction/event?orderCode=${params.orderCode}`,
      );
      console.log(data.result.event.images[0].path);
      setCart(data.result);
      console.log(data.result);

      console.log(cart);

      return data.result;
    },
  });

  const usePoint = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.patch(
        `/api/transaction/point?orderCode=${params.orderCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: (data) => {
      toast('Success to use your points');
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
      toast('cannot use your points');
    },
  });

  const handlePoints = () => {
    usePoint.mutate();
  };

  const useVoucher = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.patch(
        `/api/transaction/discount?orderCode=${params.orderCode}`,
        {
          discountcode: discount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: (data) => {
      toast('Success to use voucher');
      console.log(data.result);
    },
    onError: (error: any) => {
      console.log(error);
      toast('Cannot use your voucher');
    },
  });

  const handleVoucher = () => {
    useVoucher.mutate();
  };

  const payTransaction = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.patch(
        '/api/transaction/pay',
        { orderCode: params.orderCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: (data) => {
      toast('payment success. Return to home');
      console.log(data.result);
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    },
    onError: (error: any) => {
      toast('Error processing your payment'), console.log(error);
    },
  });

  React.useEffect(() => {}, [data?.discountTotal, user?.points]);

  const handlePayment = () => {
    payTransaction.mutate();
  };

  if (isLoading) {
    <Loading duration={2500} />;
  }

  if (isError) {
    return <p>Cannot retrieve your data</p>;
  }

  return (
    <div className="w-full flex justify-center items-center my-10 px-4 lg:my-20 lg:px-0 mb-20">
      <ToastContainer />
      <div className="w-full max-w-4xl flex flex-col gap-6 p-4 lg:p-10 items-center min-h-screen rounded-xl shadow-2xl">
        <div className="w-full">
          <p className="text-2xl lg:text-4xl">Invoice #{params.orderCode}</p>
        </div>
        <div className="w-full min-h-[40vh] relative">
          <Image
            src={
              data?.event.images.length
                ? `http://localhost:8000${data?.event.images[0].path}`
                : `/blackpink.webp`
            }
            alt="image"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
        <div className="w-full text-lg lg:text-xl">
          <p className="text-xl lg:text-3xl">
            {data?.qty}X {data?.event.title}
          </p>
          <span className="text-lg font-bold lg:text-2xl">
            {data?.event.price &&
              new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(data.discountTotal)}
          </span>
        </div>
        <div className="w-full flex flex-col gap-4 lg:gap-5">
          <Label className="text-lg lg:text-xl">Add your discount code</Label>
          <Input
            type="text"
            className="text-lg lg:text-xl"
            placeholder="Discount Code (optional)"
            onChange={(e) => setDiscount(e.target.value)}
          />
          <Button
            onClick={handleVoucher}
            disabled={data?.status === 'PAID'}
            className="w-full bg-slate-400 text-lg lg:text-xl text-white"
          >
            Add Discount Code
          </Button>
        </div>
        <div className="w-full">
          <p className="text-lg lg:text-xl">
            {user?.points && user?.points > 0
              ? `You have ${user?.points} points want to apply?`
              : 'You don’t have any points'}
          </p>
          <div className="w-full flex gap-4 lg:gap-5">
            {user?.points && user?.points > 0 ? (
              <React.Fragment>
                <Button
                  disabled={data?.status === 'PAID'}
                  onClick={handlePoints}
                  className="bg-slate-500 p-3 lg:p-5 text-lg lg:text-xl"
                >
                  Use
                </Button>
              </React.Fragment>
            ) : null}
          </div>
        </div>
        <div className="w-full flex justify-between text-sm lg:text-xl">
          <div>
            <p>Subtotal</p>
          </div>
          <div>
            <p>
              {data?.total &&
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(data.total)}
            </p>
          </div>
        </div>
        <div className="h-0.5 w-full bg-slate-300"></div>
        <div className="w-full flex justify-between text-sm lg:text-xl">
          <div>
            <p>Total</p>
          </div>
          <div>
            {discount && data?.total && (
              <span className="line-through">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(data.total)}
              </span>
            )}
            <p>
              {data &&
                data.discountTotal &&
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(data.discountTotal)}
            </p>
          </div>
        </div>
        <div className="w-full">
          <Button
            onClick={handlePayment}
            disabled={data?.status === 'PAID'}
            className="bg-slate-400 w-full text-lg lg:text-xl text-white"
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withRole(Checkout, 'USER');
