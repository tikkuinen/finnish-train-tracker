import React, { useState, useEffect } from 'react';
import { getMuuTrains, Kulkutietoviesti } from '../services/trainService';
import './TrainList.css';

const TrainList: React.FC = () => {
  const [kulkutietoviestit, setKulkutietoviestit] = useState<Kulkutietoviesti[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchKulkutietoviestit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMuuTrains();
      console.log('Fetched kulkutietoviestit:', data);
      const sorted = data.sort((a, b) => {
        const trainA = parseInt(a.trainNumber);
        const trainB = parseInt(b.trainNumber);
        if (trainA !== trainB) return trainA - trainB;
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeB - timeA; // Most recent first
      });
      setKulkutietoviestit(sorted);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately on mount
    fetchKulkutietoviestit();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchKulkutietoviestit, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="train-list-container">
      <div className="header">
        <h1>Kulkutietoviestit</h1>
        <div className="controls">
          <button
            onClick={fetchKulkutietoviestit}
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
        <p>Määrä: <strong>{kulkutietoviestit.length}</strong></p>
      </div>

      <table className="kulkutietoviesti-table">
        <thead>
          <tr>
            <th>Train Number</th>
            <th>Departure Date</th>
            <th>Timestamp</th>
            <th>Station</th>
            <th>Track Section</th>
            <th>Type</th>
            <th>Next Station</th>
            <th>Previous Station</th>
          </tr>
        </thead>
        <tbody>
          {kulkutietoviestit.map((item) => (
            <tr key={`${item.trainNumber}-${item.timestamp}`}>
              <td>{item.trainNumber}</td>
              <td>{item.departureDate}</td>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.station}</td>
              <td>{item.trackSection}</td>
              <td>{item.type}</td>
              <td>{item.nextStation || '-'}</td>
              <td>{item.previousStation || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainList;