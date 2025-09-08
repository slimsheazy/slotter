
import React, { useState, useEffect } from 'react';
import { Schedule } from '../types';
import ClipboardIcon from './icons/ClipboardIcon';

interface ScheduleDisplayProps {
  schedule: Schedule | null;
  error: string | null;
  activeTab: 'text' | 'json';
  setActiveTab: (tab: 'text' | 'json') => void;
}

const formatMinutes = (minutes: number): string => {
  if (minutes < 0) return "00:00:00";
  const totalSeconds = Math.floor(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule, error, activeTab, setActiveTab }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (schedule) {
      navigator.clipboard.writeText(JSON.stringify(schedule, null, 2));
      setCopied(true);
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      );
    }

    if (!schedule) {
      return (
        <div className="flex items-center justify-center h-full text-slate-500 text-center p-8">
          <p>Your generated schedule will appear here. <br/> Fill out the form to get started!</p>
        </div>
      );
    }

    if (activeTab === 'text') {
      return (
        <div className="space-y-4">
          <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
              <p>Time per call:</p> <p className="font-mono text-right">{formatMinutes(schedule.summary.timePerCallMinutes)}</p>
              <p>Buffer time:</p> <p className="font-mono text-right">{schedule.summary.bufferBetweenCalls} min</p>
              <p>Total call time:</p> <p className="font-mono text-right">{formatMinutes(schedule.summary.timePerCallMinutes * schedule.summary.numberOfCalls)}</p>
              <p>Total buffer time:</p> <p className="font-mono text-right">{schedule.summary.totalBufferTime} min</p>
            </div>
          </div>
          <ul className="space-y-3">
            {schedule.calls.map((call) => (
              <li key={call.callNumber} className="flex justify-between items-center bg-white p-3 rounded-md border border-slate-200 hover:shadow-sm transition">
                <span className="font-semibold text-slate-800">Call {call.callNumber}</span>
                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">{call.startTime} - {call.endTime}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (activeTab === 'json') {
      return (
        <div className="relative">
           <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-md bg-slate-700 text-slate-200 hover:bg-slate-600 transition text-sm flex items-center gap-2"
          >
            <ClipboardIcon className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{JSON.stringify(schedule, null, 2)}</code>
          </pre>
        </div>
      );
    }
    return null;
  };
  
  const TabButton: React.FC<{tab: 'text' | 'json', children: React.ReactNode}> = ({tab, children}) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition ${
        activeTab === tab
          ? 'bg-blue-600 text-white shadow'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 min-h-[480px] flex flex-col">
      <div className="flex justify-between items-center border-b pb-3 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Generated Schedule</h2>
        {schedule && (
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
            <TabButton tab="text">Text Schedule</TabButton>
            <TabButton tab="json">JSON Output</TabButton>
          </div>
        )}
      </div>
      <div className="flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};

export default ScheduleDisplay;
