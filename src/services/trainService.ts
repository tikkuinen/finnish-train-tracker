import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://rata.digitraffic.fi/api/v1';

export interface TrainLocation {
  accuracy: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
  speed?: number;
  timestamp: string;
  latitude?: number;
  longitude?: number;
}

export interface Kulkutietoviesti {
  id: number;
  version: number;
  trainNumber: string;
  departureDate: string;
  timestamp: string;
  trackSection: string;
  nextTrackSection?: string;
  previousTrackSection?: string;
  station: string;
  nextStation?: string;
  previousStation?: string;
  type: string;
}

export type Kulkutietoviestit = Kulkutietoviesti[];



//Fetch all trains in station Muurame (MUU) today
export const getMuuTrains = async (): Promise<Kulkutietoviestit> => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  try {
    const response = await axios.get(`${API_BASE_URL}/train-tracking/station/MUU/${today}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trains:', error);
    throw error;
  }
};

// Fetch train locations
export const getTrainLocations = async (
  trainNumber: number,
  departureDate: string
): Promise<TrainLocation[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/train-locations/${departureDate}/${trainNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching train locations:', error);
    throw error;
  }
};