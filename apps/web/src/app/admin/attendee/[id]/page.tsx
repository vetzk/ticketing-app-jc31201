'use client';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiCall from '@/helper/apiCall';
import { FaArrowLeft } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import withRole from '@/hoc/roleGuard';

interface IAttendeeProps {
  params: {
    id: string;
  };
}

const Attendee: React.FunctionComponent<IAttendeeProps> = ({ params }) => {
  const token = localStorage.getItem('token');
  const [search, setSearch] = React.useState<string>('');
  const [searchData, setSearchData] = React.useState<any[]>([]);
  const router = useRouter();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const { data } = await apiCall.get(
        `/api/admin/attendance?id=${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);
      setSearchData(data.result);
      return data;
    },
  });

  const handleSearch = () => {
    const filter = data.result.filter((item: any) =>
      item.ticketCode.toLowerCase().includes(search.toLowerCase()),
    );
    setSearchData(filter);
  };

  if (isLoading) {
    <Loading duration={3000} />;
  }
  return (
    <div className="w-full flex flex-col gap-5 p-5">
      <div>
        <Button
          className="bg-slate-500 text-xl p-5 text-white"
          onClick={() => router.push('/admin/profile')}
        >
          <FaArrowLeft size={30} className="" />
          {'  '}Back to home
        </Button>
      </div>
      <p className="text-3xl">Attendance List</p>
      <div className="w-full">
        <div className="w-1/4 flex items-center gap-5">
          <Input
            type="text"
            className="text-lg"
            placeholder="search ticket code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="text-lg bg-slate-300" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      <div className="bg-slate-200 h-0.5 w-full"></div>
      <div className="w-full flex flex-col text-xl">
        <div className="w-full flex justify-between items-center text-2xl p-5 bg-slate-400 rounded-xl">
          <p>Ticket Code</p>
          <p>User</p>
          <p>Status</p>
        </div>
        {searchData.length > 0 ? (
          searchData.map((item, index) => (
            <div key={index}>
              <div className="w-full flex justify-between items-center text-xl p-5">
                <p>{item.ticketCode}</p>
                <p>
                  {data?.dataUser[0].user.userprofile[0]?.firstName
                    ? data.dataUser[0].user.userprofile[0].firstName
                    : data.dataUser[0].user.email}
                </p>
                <div>
                  {' '}
                  <Input
                    type="checkbox"
                    checked={item.status === 'USED'}
                    className="h-6 w-6 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-2xl my-20 text-center justify-center items-center">
            No data found
          </div>
        )}
        {/* {data?.result[0].status ? data.result[0].status : null} */}
      </div>
    </div>
  );
};

export default withRole(Attendee, 'ADMIN');
