'use client';
import * as React from 'react';
import { CiUser, CiViewList } from 'react-icons/ci';
import {
  MdOutlinePayment,
  MdCreate,
  MdDashboard,
  MdOutlineRoomPreferences,
} from 'react-icons/md';
import { BsLayoutTextSidebar } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { Button } from './ui/button';

interface IAdminSidebarProps {}

const AdminSidebar: React.FunctionComponent<IAdminSidebarProps> = (props) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <React.Fragment>
      <div className="lg:hidden p-5">
        <Button onClick={toggleSidebar} className="text-4xl">
          {isSidebarOpen ? <FiX /> : <BsLayoutTextSidebar />}
        </Button>
      </div>

      <div
        className={`fixed left-0 w-[75%] max-w-sm h-full bg-slate-300 flex flex-col gap-10 p-5 rounded-br-xl rounded-tr-xl z-20 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:w-[20%] lg:min-h-screen lg:overflow-y-auto`}
      >
        <div className="w-full">
          <p className="text-2xl">Account</p>
        </div>
        <div className="w-full flex-col flex gap-10">
          <div
            className="w-full h-auto flex justify-start items-center gap-5 cursor-pointer"
            onClick={() => router.push('/admin/profile')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-400 flex justify-center items-center">
              <CiUser size={30} color="white" />
            </div>
            <div>
              <p className="text-xl">Profile</p>
            </div>
          </div>
          <div
            className="w-full h-auto flex justify-start items-center gap-5 cursor-pointer"
            onClick={() => router.push('/admin/event-maker')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-400 flex justify-center items-center">
              <MdCreate size={30} color="white" />
            </div>
            <div>
              <p className="text-xl">Create Event</p>
            </div>
          </div>
          <div
            className="w-full h-auto flex justify-start items-center gap-5 cursor-pointer"
            onClick={() => router.push('/admin/list')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-400 flex justify-center items-center">
              <CiViewList size={30} color="white" />
            </div>
            <div>
              <p className="text-xl">Your Event</p>
            </div>
          </div>
          <div
            className="w-full h-auto flex justify-start items-center gap-5 cursor-pointer"
            onClick={() => router.push('/admin/dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-400 flex justify-center items-center">
              <MdDashboard size={30} color="white" />
            </div>
            <div>
              <p className="text-xl">Dashboard</p>
            </div>
          </div>
          <div
            className="w-full h-auto flex justify-start items-center gap-5 cursor-pointer"
            onClick={() => router.push('/admin/balance')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-400 flex justify-center items-center">
              <MdOutlinePayment size={30} color="white" />
            </div>
            <div>
              <p className="text-xl">Balance</p>
            </div>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </React.Fragment>
  );
};

export default AdminSidebar;
