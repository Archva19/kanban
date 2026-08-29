"use client";

import { SignInSchema } from "@/validators/signin";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignIn() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignInSchema),
  });

  const router = useRouter();

  async function onSubmit(data: any) {
    try {
      setServerError(null);
      const res = await axios.post("http://localhost:3030/auth/sign-in", data);
      if (res.status === 200) {
        setCookie("accesstoken", res.data.data, { maxAge: 60 * 60 });
        router.push("/");
      }
    } catch (error: any) {
      if (error.response && error.response.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("server error, try again later");
      }
    }
  }

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col gap-6 w-[91.466%] mx-auto max-w-120 items-center ">
          <p className="heading">Sign In</p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="cardBgColor w-full p-6 md:p-8 rounded-md flex flex-col gap-8"
          >
            <div className="flex flex-col gap-6 relative">
              <div className="flex flex-col gap-2">
                <p className="formTitle">Email</p>
                <div className="relative">
                  <input
                    className={`${errors.email ? "border-red-500!" : "focusOnInput"}`}
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  <p className="inputErrorMessage">{errors.email?.message}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="formTitle">Password</p>
                <div className="relative">
                  <input
                    className={`${errors.password ? "border-red-500!" : "focusOnInput"}`}
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  <p className="inputErrorMessage">
                    {errors.password?.message}
                  </p>
                </div>
              </div>
              {serverError && (
                <div className="font-medium text-[#EA5555] absolute left-0 -bottom-6 text-[12px]">
                  {serverError}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <button type="submit" className="formBtn purpleBtn">
                  Sign In
                </button>
              </div>

              <Link className="formBtn lightPurpleBtn" href={"/sign-up"}>
                Create new account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
