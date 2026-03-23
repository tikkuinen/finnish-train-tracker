import React, { useEffect, useState } from 'react';
import { Train, TrainLocation, getTrainLocations } from '../services/trainService';

interface TrainCardProps {
  train: Train;
}

const TrainCard: React.FC<TrainCardProps> = ({ train }) => {
  const [location, setLocation] = useState<TrainLocation | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoadingLocation(true);
      try {
        const locs = await getTrainLocations(train.trainNumber);
        setLocation(locs?.[0] ?? null);
      } catch (err) {
        console.error('Error loading train location:', err);
      } finally {
        setLoadingLocation(false);
      }
    };
    fetchLocation();
  }, [train.trainNumber]);

  const loc = location ?? train.trainLocations?.[0] ?? null;
  const hasCoords =
    loc?.latitude !== undefined &&
    loc?.longitude !== undefined &&
    !Number.isNaN(loc.latitude) &&
    !Number.isNaN(loc.longitude);

  const getTrainTypeDisplay = (trainType: string) => {
    const typeMap: Record<string, string> = {
      'IC': 'InterCity',
      'IR': 'InterRegional',
      'RE': 'Regional Express',
      'S': 'Suburban',
      'P': 'Passenger',
      'SP': 'Special',
      'H': 'Freight',
      'HV': 'Freight',
    };
    return typeMap[trainType] || `${trainType}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI');
  };

  return (
    <div className={`train-card ${train.cancelled ? 'cancelled' : ''}`}>
      <h3>{train.trainNumber} {getTrainTypeDisplay(train.trainType)}</h3>
      <p>Departure {formatDate(train.departureDate)}</p>
      <p>Status: {train.cancelled ? 'Cancelled' : train.runningCurrently ? 'Running' : 'Not running'}</p>

      <p>
        Location:{' '}
        {hasCoords
          ? `${loc!.latitude.toFixed(5)}, ${loc!.longitude.toFixed(5)}`
          : 'Not available'}
      </p>

      <button onClick={() => setShowDetails(v => !v)}>
        {showDetails ? 'Hide details' : 'Show details'}
      </button>

      {loadingLocation && <p>Loading location...</p>}
      {showDetails && (
        <div className="details">
          {/* details */}
          deets
        </div>
      )}
    </div>
  );
};

export default TrainCard;