import React, { useState, useCallback } from 'react';
import InputForm from './components/InputForm';
import ScheduleDisplay from './components/ScheduleDisplay';
import { Schedule, Call } from './types';

const App: React.FC = () => {
  const [totalTime, setTotalTime] = useState<string>('');
  const [numCalls, setNumCalls] = useState<string>('');
  const [bufferTime, setBufferTime] = useState<string>('2');
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');

  const formatMinutesToTime = (minutes: number): string => {
      const totalSeconds = Math.floor(minutes * 60);
      const hours = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCalculate = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSchedule(null);

    const totalTimeMinutes = parseInt(totalTime, 10);
    const numberOfCalls = parseInt(numCalls, 10);
    const bufferBetweenCalls = parseInt(bufferTime, 10) || 0;

    if (isNaN(totalTimeMinutes) || isNaN(numberOfCalls) || totalTimeMinutes <= 0 || numberOfCalls <= 0) {
      setError("Please enter valid positive numbers for total time and number of calls.");
      return;
    }

    const totalBufferTime = numberOfCalls > 1 ? (numberOfCalls - 1) * bufferBetweenCalls : 0;

    if (totalBufferTime >= totalTimeMinutes) {
      setError("The total buffer time is greater than or equal to the total available time. Please reduce the buffer time or the number of calls.");
      return;
    }

    const availableCallTime = totalTimeMinutes - totalBufferTime;
    const timePerCallMinutes = availableCallTime / numberOfCalls;

    let currentTime = 0;
    const calls: Call[] = [];
    for (let i = 0; i < numberOfCalls; i++) {
      const startTime = currentTime;
      const endTime = startTime + timePerCallMinutes;
      calls.push({
        callNumber: i + 1,
        startTime: formatMinutesToTime(startTime),
        endTime: formatMinutesToTime(endTime),
      });
      currentTime = endTime + bufferBetweenCalls;
    }

    setSchedule({
      summary: {
        totalTime: totalTimeMinutes,
        numberOfCalls,
        bufferBetweenCalls,
        timePerCallMinutes,
        totalBufferTime,
      },
      calls,
    });
    setActiveTab('text');
  }, [totalTime, numCalls, bufferTime]);

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">SLOTTER</h1>
          <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">
            Effortlessly plan your call schedule. Just enter your constraints and get an instant, detailed timeline.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <InputForm
              totalTime={totalTime}
              setTotalTime={setTotalTime}
              numCalls={numCalls}
              setNumCalls={setNumCalls}
              bufferTime={bufferTime}
              setBufferTime={setBufferTime}
              handleSubmit={handleCalculate}
            />
          </div>
          <div className="lg:col-span-3">
            <ScheduleDisplay
              schedule={schedule}
              error={error}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Built with React & Tailwind CSS.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;