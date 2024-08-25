'use client';
import AdminSidebar from '@/components/AdminSidebar';
import Loading from '@/components/Loading';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import apiCall from '@/helper/apiCall';
import withRole from '@/hoc/roleGuard';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import * as React from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface IAdminDashboardProps {}
const chartConfig = {
  desktop: {
    label: 'Revenue',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const AdminDashboard: React.FunctionComponent<IAdminDashboardProps> = () => {
  const token = localStorage.getItem('token');
  const [timeFrame, setTimeFrame] = React.useState<'day' | 'month' | 'year'>(
    'month',
  );
  const { data, isError, isLoading } = useQuery({
    queryKey: ['analytics', timeFrame],
    queryFn: async () => {
      const { data } = await apiCall.get('/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
  });

  if (isError) {
    return <p>Cannot fetch your data</p>;
  }

  if (isLoading) {
    return <Loading duration={3000} />;
  }

  const revenueByDay = data?.revenueByDay || {};
  const revenueByMonth = data?.revenueByMonth || {};
  const revenueByYear = data?.revenueByYear || {};

  const revenueData =
    timeFrame === 'day'
      ? revenueByDay
      : timeFrame === 'month'
        ? revenueByMonth
        : revenueByYear;

  if (!revenueData || Object.keys(revenueData).length === 0) {
    return <p>No revenue data available for the selected timeframe.</p>;
  }

  const chartData = Object.entries(revenueData).map(([key, value]) => ({
    time: key,
    revenue: value,
  }));

  return (
    <div className="flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-5 lg:ml-[30rem]">
        <div className="w-full h-auto grid grid-cols-1 lg:grid-cols-3 grid-rows-6 lg:grid-rows-2 gap-4 lg:gap-8">
          <div className="w-full border border-slate-400 flex flex-col gap-3 p-3">
            <p className="text-2xl">Active Event</p>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex items-center gap-3">
              <p className="text-6xl">{data?.count ? data.count : 0}</p>
              <p className="text-xl font-bold">Event</p>
            </div>
          </div>
          <div className="w-full border border-slate-400 flex flex-col gap-3 p-3">
            <p className="text-2xl">Ended Event</p>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex items-center gap-3">
              <p className="text-6xl">0</p>
              <p className="text-xl font-bold">Event</p>
            </div>
          </div>

          <div className="w-full border border-slate-400 flex flex-col gap-3 p-3">
            <p className="text-2xl">Total Revenue</p>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex items-center gap-3">
              <p className="text-4xl">
                {data?.total.totalRevenue
                  ? new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(data.total.totalRevenue)
                  : 0}
              </p>
            </div>
          </div>

          <div className="w-full border border-slate-400 flex flex-col gap-3 p-3">
            <p className="text-2xl">Transaction</p>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex items-center gap-3">
              <p className="text-6xl">
                {data?.transaction ? data.transaction : 0}
              </p>
            </div>
          </div>

          <div className="w-full border border-slate-400 flex flex-col gap-3 p-3">
            <p className="text-2xl">Total Tickets Sold</p>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex items-center gap-3">
              <p className="text-6xl">
                {data?.total.totalTicketsSold ? data.total.totalTicketsSold : 0}
              </p>
              <p className="text-xl font-bold">Ticket</p>
            </div>
          </div>

          <div className="w-full border border-slate-400 flex flex-col gap-3 p-3">
            <p className="text-2xl">Total Attendee</p>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex items-center gap-3">
              <p className="text-6xl">
                {data?.total.totalAttendance ? data.total.totalAttendance : 0}
              </p>
              <p className="text-xl font-bold">Person</p>
            </div>
          </div>
        </div>

        <div className="my-8 flex justify-center gap-4">
          <button
            onClick={() => setTimeFrame('day')}
            className={`px-4 py-2 ${
              timeFrame === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeFrame('month')}
            className={`px-4 py-2 ${
              timeFrame === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeFrame('year')}
            className={`px-4 py-2 ${
              timeFrame === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Yearly
          </button>
        </div>

        <div className="w-full mt-16">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} stroke="#ccc" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (timeFrame === 'month') {
                      const date = new Date(value);
                      return format(date, 'MMMM');
                    }
                    if (timeFrame === 'year') {
                      return value;
                    }
                    return value;
                  }}
                />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={chartConfig.desktop.color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default withRole(AdminDashboard, 'ADMIN');
