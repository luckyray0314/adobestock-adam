"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';
import { useContext, useState } from "react";
import { ToastContext } from "@/components/Contexts/ToastContext";

import { Button, Input, Checkbox, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import Image from "next/image";
import axios from "axios";

export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isemail, setIsEmail] = React.useState(false);
  const [isPassword, setIsPassword] = React.useState(false);
  const { toast } = useContext<any>(ToastContext);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const SignInHandle = async function () {
    if (email == "") {
      setIsEmail(true);
      setEmail("");
    }

    if (password == "") {
      setIsPassword(true);
      setPassword("");
    }
    if (email && password) {
      await axios.post('/api/auth/login', {
        email,
        password
      }).then((res) => {
        if (res.data.status === 200) {
          toast.success("Successfully logged in");
          router.push("/home")
        }
      }).catch(() => {
        toast.error("Internal Server error");
      })
    } else {
      setEmail("")
      setPassword("")
      toast.error("Credential is not correct");
    }
  }

  return (
    <div
      className="flex h-screen w-screen items-center justify-end overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-8"
      style={{
        backgroundImage:
          "url(https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/black-background-texture.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Brand Logo */}
      <div className="absolute left-10 top-10">
        <div className="flex items-center gap-4">
          <Image src="https://cdn.prod.website-files.com/img/favicon.ico" width={40} height={40} alt="" />
          <p className="font-medium text-white">Keyworder</p>
        </div>
      </div>

      {/* Testimonial */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <p className="max-w-xl text-white/60">
          Keyworder is a free keywording tool for microstock photographers.
        </p>
      </div>

      {/* Login Form */}
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Log In</p>
        <div className="flex flex-col gap-3">
          <Input
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            isInvalid={isemail}
            errorMessage="Email is required"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            isInvalid={isPassword}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage="Password is required"
            variant="bordered"
          />
          <div className="flex items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button color="primary" type="submit" onClick={() => SignInHandle()}>
            Log In
          </Button>
        </div>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
            onClick={() => signIn('google', { callbackUrl: '/home' })}
          >
            Continue with Google
          </Button>
        </div>
        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link href="/signup" size="sm">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
