import React from "react";
import { Trash2, MapPin } from "lucide-react";

interface SavedLocationsProps {
  locations: string[];
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
}

const SavedLocations: React.FC<SavedLocationsProps> = ({
  locations,
  onSelect,
  onRemove,
}) => {
  return (
    <div className="saved-locations">
      <h3>Locations</h3>

      {locations.length === 0 && <p>No saved cities yet.</p>}

      <ul>
        {locations.map((city) => (
          <li key={city} className="saved-location-item">
            <button
              className="location-btn"
              onClick={() => onSelect(city)}
            >
              <MapPin size={18} />
              {city}
            </button>

            <button
              className="remove-btn"
              onClick={() => onRemove(city)}
            >
              <Trash2 size={21} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedLocations;