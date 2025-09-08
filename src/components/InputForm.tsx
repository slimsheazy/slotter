
import React from 'react';

interface InputFormProps {
  totalTime: string;
  setTotalTime: (value: string) => void;
  numCalls: string;
  setNumCalls: (value: string) => void;
  bufferTime: string;
  setBufferTime: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const InputField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}> = ({ id, label, value, onChange, placeholder, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      type="number"
      id={id}
      value={value}
      onChange={onChange}
      min="0"
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 bg-slate-800 text-white placeholder:text-slate-400 border border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
    />
  </div>
);

const InputForm: React.FC<InputFormProps> = ({
  totalTime,
  setTotalTime,
  numCalls,
  setNumCalls,
  bufferTime,
  setBufferTime,
  handleSubmit,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 border-b pb-3">Your Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          id="totalTime"
          label="Total Time Available (minutes)"
          value={totalTime}
          onChange={(e) => setTotalTime(e.target.value)}
          placeholder="e.g., 60"
          required
        />
        <InputField
          id="numCalls"
          label="Number of Calls"
          value={numCalls}
          onChange={(e) => setNumCalls(e.target.value)}
          placeholder="e.g., 5"
          required
        />
        <InputField
          id="bufferTime"
          label="Buffer Between Calls (minutes)"
          value={bufferTime}
          onChange={(e) => setBufferTime(e.target.value)}
          placeholder="e.g., 2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Calculate Schedule
        </button>
      </form>
    </div>
  );
};

export default InputForm;
