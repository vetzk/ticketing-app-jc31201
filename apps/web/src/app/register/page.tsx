"use client";
import apiCall from "@/helper/axiosInstance";
import router from "next/router";
import * as React from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { toast } from "react-toastify";
import Navbar from "../control-layout/navbar";

interface IRegisterPageProps {}

const RegisterPage: React.FunctionComponent<IRegisterPageProps> = (props) => {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const onSubmit = async (): Promise<void> => {
    try {
      if (passwordRef.current?.value === confirmPasswordRef.current?.value) {
        const regis = await apiCall.post("/auth/regis", {
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        });
        toast(regis.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return ( 
    <div> 
    <Navbar /> 
    <div className="bg-slate-50 h-screen flex items-center">
      <div
        id="container"
        className="w-4/12 bg-slate-100 m-auto shadow-lg rounded-md p-8"
      >
        <h1 className="w-full text-center font-semibold text-2xl">
          Create Your Account
        </h1>
        <div className="h-96 flex flex-col justify-between mt-16 px-24">
          <div>
            <label className="block text-xl my-2">Email</label>
            <input
              className="w-full p-2 rounded-md flex-1"
              type="text"
              ref={emailRef}
            />
          </div>
          <div>
            <label className="block text-xl my-2">Password</label>
            <div className="relative flex items-center">
              <input
                className="w-full p-2 rounded-md flex-1"
                type={isVisible ? "text" : "password"}
                ref={passwordRef}
              />
              <button
                className="absolute right-4"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <MdVisibility size={24} />
                ) : (
                  <MdVisibilityOff size={24} />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xl my-2">Confirmation Password</label>
            <div className="relative flex items-center">
              <input
                className="w-full p-2 rounded-md flex-1"
                type={isVisible ? "text" : "password"}
                ref={confirmPasswordRef}
              />
              <button
                className="absolute right-4"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <MdVisibility size={24} />
                ) : (
                  <MdVisibilityOff size={24} />
                )}
              </button>
            </div> 

            <div className="flex gap-4">
            <button
              className="border border-slate-600 text-slate-600 p-3 w-full rounded-md shadow my-4"
              onClick={() => router.push("/login")}
            >
              login
            </button>
            <button
              className="bg-slate-500 text-white p-3 w-full rounded-md shadow my-4"
              onClick={onSubmit}
            >
              Register
            </button>
          </div>

          </div>
                  </div>
      </div>
    </div> </div> 
  );
};

export default RegisterPage;
