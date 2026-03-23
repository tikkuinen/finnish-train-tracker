import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://rata.digitraffic.fi/api/v1';

export interface TrainLocation {
  longitude: number;
  latitude: number;
  speed: number;
  timestamp: string;
}

export interface TrainStop {
  stationUICCode: number;
  stationShortCode: string;
  actualTime?: string;
  scheduledTime: string;
  estimatedTime?: string;
  type: string;
  cancelled: boolean;
  commercialStop: boolean;
}

export interface Train {
  trainNumber: number;
  departureDate: string;
  trainType: string;
  trainCategory: string;
  commuterLineID: string;
  runningCurrently: boolean;
  cancelled: boolean;
  operatorUICCode: number;
  operatorShortCode: string;
  trainLocations?: TrainLocation[];
  timeTableRows?: TrainStop[];
}

// Fetch all currently running trains
// export const getAllTrains = async (): Promise<Train[]> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/trains`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching trains:', error);
//     throw error;
//   }
// };


export const getRunningTrains = async (): Promise<Train[]> => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const url = `${API_BASE_URL}/trains`;

  //console.log('[getRunningTrains] URL', url);
  try {
    const res = await axios.get<Train[]>(url);
    //console.log('[getRunningTrains] OK', res.status, 'count', res.data.length);
    return res.data;
  } catch (error) {
    const axiosErr = error as AxiosError;
    console.error('[getRunningTrains] failed', {
      message: axiosErr.message,
      status: axiosErr.response?.status,
      data: axiosErr.response?.data,
      headers: axiosErr.response?.headers,
    });
    throw error;
  }
};

// Fetch train details by number
export const getTrainDetails = async (
  trainNumber: number,
  departureDate: string
): Promise<Train> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/trains/${departureDate}/${trainNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching train details:', error);
    throw error;
  }
};

// Fetch train locations
export const getTrainLocations = async (
  trainNumber: number
): Promise<TrainLocation[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/train-locations/latest/${trainNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching train locations:', error);
    throw error;
  }
};