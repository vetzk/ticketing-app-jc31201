'use client';
import * as React from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaUserFriends,
} from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import Image from 'next/image';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

interface IRegisterProps {}

const Register: React.FunctionComponent<IRegisterProps> = (props) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] =
    React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [refCode, setRefCode] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [role, setRole] = React.useState<string>('');
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.post('/api/auth/register', {
        email,
        password,
        confirmPassword,
        refCode,
        role,
      });
      return data;
    },
    onSuccess: (data) => {
      console.log(data.result);
      localStorage.setItem('token', data.result.token);
      router.replace('/');
    },
    onError: (error: any) => {
      console.log(error);
      toast(error.response.data.message);
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <div className="w-full flex justify-center items-center">
      <Image
        layout="fill"
        src={'/events-background-1.jpg'}
        alt={'image'}
        objectFit="cover"
      />
      <div className="w-1/4 rounded-xl shadow-2xl p-5 h-auto bg-slate-200 bg-opacity-50 flex flex-col justify-center items-center gap-5 z-10">
        <ToastContainer />
        <div className="w-full h-auto flex flex-col justify-center items-center gap-3 text-white">
          <p className="font-bold text-3xl">Register Event</p>
          <p>Please Register to explore your dream event</p>
        </div>
        <div className="w-full h-auto justify-center items-center flex flex-col gap-3">
          <Button className="w-full h-auto p-3 bg-red-600 text-white rounded-xl shadow-2xl flex justify-center items-center gap-2 font-bold">
            <FaGoogle size={20} />
            Register with Google
          </Button>
          <Button className="w-full h-auto p-3 bg-blue-600 text-white rounded-xl shadow-2xl flex justify-center items-center gap-2 font-bold">
            <FaFacebookF size={20} />
            Register with Facebook
          </Button>
        </div>
        <div className="w-full flex items-center justify-center my-4">
          <div className="w-full h-px bg-gray-400" />
          <span className="px-3 text-white">or</span>
          <div className="w-full h-px bg-gray-400" />
        </div>
        <div className="w-full h-auto flex relative items-center">
          <MdOutlineEmail size={30} className="absolute left-2" />
          <Input
            type="email"
            className="w-full h-auto p-3 pl-14 rounded-xl shadow-2xl"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full h-auto flex relative justify-center items-center">
          <RiLockPasswordLine size={30} className="absolute left-2" />
          <Input
            type={isVisible ? 'text' : 'password'}
            className="w-full h-auto p-3 pl-14 rounded-xl shadow-2xl"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="absolute right-0 bottom-0.5"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <FaEyeSlash size={30} /> : <FaEye size={30} />}
          </Button>
        </div>
        <div className="w-full h-auto flex relative justify-center items-center">
          <RiLockPasswordLine size={30} className="absolute left-2" />
          <Input
            type={isConfirmVisible ? 'text' : 'password'}
            className="w-full h-auto p-3 pl-14 rounded-xl shadow-2xl"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            className="absolute right-0 bottom-0.5"
            onClick={() => setIsConfirmVisible(!isConfirmVisible)}
          >
            {isConfirmVisible ? <FaEyeSlash size={30} /> : <FaEye size={30} />}
          </Button>
        </div>
        <div className="w-full h-auto flex relative items-center">
          <FaUserFriends size={30} className="absolute left-2" />
          <Input
            type="text"
            className="w-full h-auto p-3 pl-14 rounded-xl shadow-2xl"
            placeholder="Referral Code(optional)"
            onChange={(e) => setRefCode(e.target.value)}
          />
        </div>
        <div className="w-full gap-5 h-auto flex relative text-xl text-white font-bold justify-center items-center">
          <div className="w-full flex justify-center items-center">
            <RadioGroup
              className="w-full flex justify-center gap-20 items-center"
              onValueChange={(value) => setRole(value)}
            >
              <div className="flex justify-center items-center gap-5">
                {' '}
                <RadioGroupItem value="USER" />
                <Label className="text-xl font-bold">User</Label>
              </div>
              <div className="flex justify-center items-center gap-5">
                <RadioGroupItem value="ADMIN" />
                <Label className="text-xl font-bold">Organizer</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="w-full h-auto justify-center items-center flex">
          <Button
            onClick={handleSubmit}
            className="w-full h-auto p-3 bg-slate-500 rounded-xl shadow-2xl shadow-slate-400 font-bold text-white"
          >
            REGISTER
          </Button>
        </div>
        <div className="w-full h-auto justify-center items-center flex text-white">
          <p>
            Already have an account ?{' '}
            <Link href="/login" className="underline">
              Login Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
