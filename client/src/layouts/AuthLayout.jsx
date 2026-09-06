import React from 'react';
import { Outlet } from 'react-router-dom';
import { Users } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-bgTint flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Ambient Decorative Circles matching reference UI */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-plum-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-plum-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-plum-700 flex items-center justify-center text-white shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-plum-700 leading-none">PeoplePay360</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Human Resource & Payroll Management</p>
          </div>
        </div>
        <div className="hidden sm:block text-xs font-semibold text-slate-400 space-x-2">
          <span>People</span>
          <span>|</span>
          <span>Process</span>
          <span>|</span>
          <span>Progress</span>
        </div>
      </header>

      {/* Main Grid: Left Hero Message + Right Auth Card Container */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
        
        {/* Left Side Hero Message (Matching Screenshot 1) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-center space-y-4 pr-6">
          <h2 className="text-4xl font-extrabold text-plum-800 leading-tight tracking-tight">
            People<br />Power<br />Organizations
          </h2>
          <div className="w-12 h-1 bg-plum-700 rounded-full my-2" />
          <p className="text-slate-500 text-base font-normal max-w-sm">
            A smarter and simpler way to manage your workforce, contracts, time off, and payroll.
          </p>
        </div>

        {/* Right Side Form Box */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-plum-100/60">
            <Outlet />
          </div>
        </div>

      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 flex justify-between items-center text-xs text-slate-400">
        <div>WORK TODAY FOR A BRIGHTER TOMORROW</div>
        <div className="text-right">Efficient People • Stronger Businesses</div>
      </footer>

    </div>
  );
};

export default AuthLayout;
