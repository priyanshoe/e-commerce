import { Loader2 } from 'lucide-react';

const Loading = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div id="loading-fullscreen" className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="loading-inline" className="flex items-center justify-center p-6 gap-3">
      <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
      <span className="text-sm text-slate-500">{message}</span>
    </div>
  );
};

export default Loading;
