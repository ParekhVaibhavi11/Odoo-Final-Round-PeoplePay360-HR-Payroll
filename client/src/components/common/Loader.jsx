import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = 'Loading data...' }) => {
  return (
    <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
      <span className="text-sm font-semibold text-slate-500">{text}</span>
    </div>
  );
};

export default Loader;
