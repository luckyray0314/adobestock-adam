'use client'
import { NextUIProvider } from '@nextui-org/react'
import { StoreProvider, store } from "@/components/Jotai/store";
import { DevTools } from 'jotai-devtools';

import Navbar from "@/components/Nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NextUIProvider>
        <StoreProvider>
          <DevTools store={store} />
          <div className="flex flex-row">
            <Navbar />
            {children}
          </div>
        </StoreProvider>
      </NextUIProvider>
    </>
  );
}
