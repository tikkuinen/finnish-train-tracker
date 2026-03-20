import React, { useState, useEffect } from 'react';
import { getRunningTrains, Train } from '../services/trainService';
import TrainCard from './TrainCard';
import './TrainList.css';

const TrainList: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTrains = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRunningTrains();
      setTrains(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch trains. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch trains immediately on mount
    fetchTrains();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchTrains, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="train-list-container">
      <div className="header">
        <h1>🚂 Finnish Train Tracker</h1>
        <div className="controls">
          <button
            onClick={fetchTrains}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh Now'}
          </button>
          {lastUpdated && (
            <p className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats">
        <p>Total running trains: <strong>{trains.length}</strong></p>
      </div>

      <div className="train-grid">
        {trains.length === 0 && !loading ? (
          <p className="no-trains">No trains currently running</p>
        ) : (
          trains.map((train) => (
            <TrainCard key={`${train.departureDate}-${train.trainNumber}`} train={train} />
          ))
        )}
      </div>
    </div>
  );
};

export default TrainList;