'use client';
import * as React from 'react';
import { CiUser } from 'react-icons/ci';
import { MdOutlinePayment, MdOutlineRoomPreferences } from 'react-icons/md';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useRouter } from 'next/navigation';

interface IProfileSidebarProps {}

const ProfileSidebar: React.FunctionComponent<IProfileSidebarProps> = (
  props,
) => {
  const router = useRouter();
  return (
    <div className="fixed left-0 w-[20%] min-h-screen bg-slate-300 flex flex-col gap-10 p-5 rounded-br-xl rounded-tr-xl">
      <div className="w-full">
        <p className="text-2xl">Account</p>
      </div>
      <div className="w-full flex-col flex gap-10">
        <div
          className="w-full h-auto flex justify-start items-center gap-5 cursor-pointer"
          onClick={() => router.push('/user/profile')}
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
          onClick={() => router.push('/user/payment-history')}
        >
          <div className="w-10 h-10 rounded-xl bg-slate-400 flex justify-center items-center">
            <MdOutlinePayment size={30} color="white" />
          </div>
          <div>
            <p className="text-xl">Purchase history</p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <p className="text-2xl">System</p>
      </div>
      <div className="w-full flex-col flex gap-10">
        <div className="w-full h-auto flex justify-start items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-slate-400 flex justify-center items-center">
            <IoMdNotificationsOutline size={30} color="white" />
          </div>
          <div>
            <p className="text-xl">Notification</p>
          </div>
        </div>
        <div className="w-full h-auto flex justify-start items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-slate-400 flex justify-center items-center">
            <MdOutlineRoomPreferences size={30} color="white" />
          </div>
          <div>
            <p className="text-xl">Preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
