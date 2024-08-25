'use client';
import Loading from '@/components/Loading';
import ProfileSidebar from '@/components/ProfileSidebar';
import { Transaction } from '@/contexts/type';
import apiCall from '@/helper/apiCall';
import withRole from '@/hoc/roleGuard';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import * as React from 'react';

interface IPaymentHistoryProps {}

const PaymentHistory: React.FunctionComponent<IPaymentHistoryProps> = (
  props,
) => {
  const [historyTransaction, setHistoryTransaction] = React.useState<
    Transaction[]
  >([]);
  const token = localStorage.getItem('token');

  const { data, isError, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const { data } = await apiCall.get('/api/transaction/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistoryTransaction(data.result);
      console.log(data.result);

      return data.result;
    },
  });

  if (isLoading) {
    <Loading duration={2500} />;
  }

  if (isError) {
    return <p>Cannot retrieve your data</p>;
  }
  return (
    <div className="flex flex-col lg:flex-row">
      <ProfileSidebar />
      <div className="flex-1 p-5 lg:ml-[30rem]">
        <div className="w-full h-auto justify-center gap-5 flex-col flex items-center">
          <div className="w-full">
            <p className="text-2xl">Your Payment History</p>
          </div>
          {historyTransaction.map((e, i) => (
            <React.Fragment key={i}>
              <div className="w-full flex flex-col lg:flex-row lg:gap-10 gap-5">
                <div>
                  <Image
                    src={
                      e.event.images.length > 0
                        ? `http://localhost:8000${e.event.images[0].path}`
                        : '/blackpink.webp'
                    }
                    alt={'image'}
                    width={400}
                    height={300}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex flex-col justify-center text-center items-start gap-3">
                  <div>
                    <p className="text-2xl font-bold">{e.event.title}</p>
                  </div>
                  <div>
                    <p className="text-xl">Saturday, 10 September 2024</p>
                  </div>
                  <div>
                    <p className="text-xl">
                      Total Price:{' '}
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(e.discountTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl">Quantity: {e.qty}</p>
                  </div>
                  <div>
                    <p className="text-xl">Status: {e.status}</p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-0.5"></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withRole(PaymentHistory, 'USER');
