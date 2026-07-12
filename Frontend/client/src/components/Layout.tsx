import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full text-left">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 box-border">
        <Outlet />
      </main>
    </div>
  );
}