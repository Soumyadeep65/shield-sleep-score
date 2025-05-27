declare const process: {
    env: {
      [key: string]: string | undefined;
    };
  };
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api/sleep-score'; 