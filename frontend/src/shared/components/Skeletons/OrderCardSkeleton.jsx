import React from 'react';

/**
 * OrderCardSkeleton - Loading placeholder for order cards
 */
const OrderCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
        <div className="h-8 w-8 bg-slate-200 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-3/4 bg-slate-100 rounded" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
