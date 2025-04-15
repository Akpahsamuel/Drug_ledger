import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-start gap-3">
      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-medium">Error</h3>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
} 