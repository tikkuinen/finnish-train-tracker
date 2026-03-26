import React from 'react';
import { Kulkutietoviesti } from '../services/trainService';

interface KulkutietoviestiCardProps {
  kulkutietoviesti: Kulkutietoviesti;
}

const KulkutietoviestiCard: React.FC<KulkutietoviestiCardProps> = ({ kulkutietoviesti }) => {
  return (
    <div className="kulkutietoviesti-card">
      <h3>Train {kulkutietoviesti.trainNumber}</h3>
      <p>Departure Date: {kulkutietoviesti.departureDate}</p>
      <p>Timestamp: {new Date(kulkutietoviesti.timestamp).toLocaleString()}</p>
      <p>Station: {kulkutietoviesti.station}</p>
      <p>Track Section: {kulkutietoviesti.trackSection}</p>
      <p>Type: {kulkutietoviesti.type}</p>
      {kulkutietoviesti.nextStation && <p>Next Station: {kulkutietoviesti.nextStation}</p>}
      {kulkutietoviesti.previousStation && <p>Previous Station: {kulkutietoviesti.previousStation}</p>}
      {kulkutietoviesti.nextTrackSection && <p>Next Track Section: {kulkutietoviesti.nextTrackSection}</p>}
      {kulkutietoviesti.previousTrackSection && <p>Previous Track Section: {kulkutietoviesti.previousTrackSection}</p>}
    </div>
  );
};

export default KulkutietoviestiCard;

