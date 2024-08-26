'use client';
import * as React from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import { UserContext } from '@/contexts/UserContext';
import withAuth from '@/hoc/authGuard';

interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { user, setUser } = React.useContext(UserContext);

  const mutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const { data } = await apiCall.post('/api/auth/login', {
        email,
        password,
      });

      return data;
    },
    onSuccess: (data) => {
      setIsLoading(false);
      localStorage.setItem('token', data.result.token);
      setUser({
        email: data.result.email,
        identificationId: data.result.identificationId,
        refCode: data.result.refCode,
        role: data.result.role,
        points: data.result.points,
        image: data.result.image,
      });

      router.replace('/');

      router.replace('/');
    },
    onError: (error: any) => {
      setIsLoading(false);
      toast(error.response.data.message);
      if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data.error.errors)
      ) {
        error.response.data.error.errors.forEach((err: any) => {
          toast(err.msg);
        });
      }
    },
  });

  const handleLogin = () => {
    mutation.mutate();
  };

  React.useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden p-10 lg:mb-0 mb-20">
      <Image
        src={'/events-background-1.jpg'}
        alt={'image'}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 -z-10"
      />
      <div className="w-full max-w-sm rounded-xl shadow-2xl p-5 h-auto bg-slate-200 bg-opacity-75 flex flex-col justify-center items-center gap-5 z-10">
        <ToastContainer />
        <div className="w-full h-auto flex flex-col justify-center items-center gap-3">
          <p className="font-bold text-3xl text-center">Login Event</p>
          <p className="text-center">
            Please login to explore your dream event
          </p>
        </div>
        <div className="w-full h-auto justify-center items-center flex flex-col gap-3">
          <button className="w-full p-3 bg-red-600 text-white rounded-xl shadow-2xl flex justify-center items-center gap-2 font-bold">
            <FaGoogle size={20} />
            Login with Google
          </button>
          <button className="w-full p-3 bg-blue-600 text-white rounded-xl shadow-2xl flex justify-center items-center gap-2 font-bold">
            <FaFacebookF size={20} />
            Login with Facebook
          </button>
        </div>
        <div className="w-full flex items-center justify-center my-4">
          <div className="w-full h-px bg-gray-400" />
          <span className="px-3 text-white">or</span>
          <div className="w-full h-px bg-gray-400" />
        </div>
        <div className="w-full h-auto flex relative items-center">
          <MdOutlineEmail
            size={30}
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          />
          <input
            type="email"
            className="w-full h-auto p-3 pl-14 rounded-xl shadow-2xl"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full h-auto flex relative items-center">
          <RiLockPasswordLine
            size={30}
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          />
          <input
            type={isVisible ? 'text' : 'password'}
            className="w-full h-auto p-3 pl-14 rounded-xl shadow-2xl"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {isVisible ? <FaEyeSlash size={30} /> : <FaEye size={30} />}
          </button>
        </div>
        <div className="w-full h-auto flex justify-end items-center">
          <p className="text-lg">
            <Link href="/forgot-password">forgot your password?</Link>
          </p>
        </div>
        <div className="w-full h-auto flex justify-center items-center">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full p-3 bg-slate-500 rounded-xl shadow-2xl shadow-slate-400 font-bold text-white"
          >
            {isLoading ? <ClipLoader size={30} color="white" /> : 'LOGIN'}
          </button>
        </div>
        <div className="w-full h-auto flex justify-center items-center text-white">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Login);
