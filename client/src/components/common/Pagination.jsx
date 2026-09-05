import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;

  return (
    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
      <div>
        Showing <strong className="text-slate-800">{pagination.page}</strong> of{' '}
        <strong className="text-slate-800">{pagination.totalPages}</strong> pages ({pagination.total} total items)
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.page - 1)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 font-semibold transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Previous
        </button>
        <span className="w-7 h-7 rounded-lg bg-plum-700 text-white font-bold flex items-center justify-center shadow-sm">
          {pagination.page}
        </span>
        <button
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 font-semibold transition-colors"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
