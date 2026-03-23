import React, { useState, useEffect } from 'react';
import { Train, TrainLocation } from '../services/trainService';
import { getTrainLocations } from '../services/trainService'
import './TrainCard.css';

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
        const locations = await getTrainLocations(train.trainNumber);
        if (locations && locations.length > 0) {
          setLocation(locations[0]);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchLocation();
  }, [train.trainNumber]);

  const getTrainTypeDisplay = (trainType: string) => {
    const typeMap: Record<string, string> = {
      'IC': '🚄 InterCity',
      'IR': '🚆 InterRegional',
      'RE': '🚂 Regional Express',
      'S': '🚆 Suburban',
      'P': '🚂 Passenger',
      'SP': '🚂 Special',
      'H': '🚂 Freight',
      'HV': '🚂 Freight',
    };
    return typeMap[trainType] || `${trainType}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI');
  };

  return (
    <div className={`train-card ${train.cancelled ? 'cancelled' : ''}`}>
      <div className="train-header">
        <div className="train-info">
          <h3>{getTrainTypeDisplay(train.trainType)} #{train.trainNumber}</h3>
          <p className="operator">{train.operatorShortCode}</p>
        </div>
        <button
          className="details-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '−' : '+'}
        </button>
      </div>

      {train.cancelled && <div className="cancelled-badge">CANCELLED</div>}

      <div className="train-body">
        <div className="info-row">
          <span className="label">Date:</span>
          <span>{formatDate(train.departureDate)}</span>
        </div>

        {location && (
          <>
            <div className="info-row">
              <span className="label">Location:</span>
              <span>
                📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Speed:</span>
              <span>⚡ {location.speed} km/h</span>
            </div>
            <div className="info-row">
              <span className="label">Last Update:</span>
              <span>{new Date(location.timestamp).toLocaleTimeString('fi-FI')}</span>
            </div>
          </>
        )}

        {loadingLocation && <p className="loading-text">Loading location...</p>}

        {showDetails && (
          <div className="details-section">
            <p><strong>Train Category:</strong> {train.trainCategory}</p>
            {train.commuterLineID && (
              <p><strong>Commuter Line:</strong> {train.commuterLineID}</p>
            )}
            <p><strong>Running:</strong> {train.runningCurrently ? '✓ Yes' : '✗ No'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainCard;