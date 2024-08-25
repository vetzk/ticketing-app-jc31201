'use client';
import Loading from '@/components/Loading';
import ProfileSidebar from '@/components/ProfileSidebar';
import apiCall from '@/helper/apiCall';
import withRole from '@/hoc/roleGuard';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';

interface IVoucherProps {}

const Voucher: React.FunctionComponent<IVoucherProps> = (props) => {
  const token = localStorage.getItem('token');
  const { data, isError, isLoading } = useQuery({
    queryKey: ['voucher'],
    queryFn: async () => {
      const { data } = await apiCall.get('/api/discount/voucher', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.result;
    },
  });

  if (isLoading) {
    <Loading duration={3000} />;
  }

  if (isError) {
    <p>Failed to fetch your data</p>;
  }
  return (
    <div className="flex flex-col lg:flex-row">
      <ProfileSidebar />
      <div className="flex-1 p-5 lg:ml-[25rem]">
        <div className="w-full h-auto flex flex-col gap-10">
          <div className="w-full">
            <div className="w-full ">
              <p className="text-2xl">Your Voucher</p>
              <p className="text-slate-500">Chcek your voucher list</p>
            </div>
            <div className="flex lg:flex-row lg:justify-between flex-col py-3 border-b">
              <p className="text-lg">
                Voucher Code: {data?.code ? data.code : null}
              </p>
              <p className="text-lg">{data?.amount ? data.amount : null}%</p>

              <p className="text-lg">
                status:{' '}
                <span className="text-green-500">
                  {data?.codeStatus ? data.codeStatus : null}
                </span>
              </p>
              <p className="text-lg">
                Valid from:{' '}
                <span>
                  {data?.validFrom
                    ? new Date(data.validFrom).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : null}
                </span>
              </p>
              <p className="text-lg">
                Valid to:{' '}
                <span>
                  {' '}
                  {data?.validTo
                    ? new Date(data.validTo).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : null}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRole(Voucher, 'USER');
