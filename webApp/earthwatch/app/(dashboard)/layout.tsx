import Navbar from '@/components/Navbar';
import React from 'react';

const DashBoardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <div className="">
        <Navbar />
      </div>
      <main className="mt-10">{children}</main>
    </>
  );
};

export default DashBoardLayout;
