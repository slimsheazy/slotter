
export interface Call {
  callNumber: number;
  startTime: string;
  endTime: string;
}

export interface Schedule {
  summary: {
    totalTime: number;
    numberOfCalls: number;
    bufferBetweenCalls: number;
    timePerCallMinutes: number;
    totalBufferTime: number;
  };
  calls: Call[];
}
