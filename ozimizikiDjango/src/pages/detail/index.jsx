import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BuildingCard from '../../components/BuildingCard';
import RoomCard from '../../components/RoomCard';

export default function Detail() {
  const { id } = useParams();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/building/${id}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBuilding(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilding();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!building) {
    return <div>No building found</div>;
  }

  return (
    <div className="building-detail">
      <BuildingCard
        id={building.id}
        photo={building.photo}
        name={building.name}
        region={building.region}
        city={building.city}
        district={building.district}
        street={building.street}
        house={building.house}
        rooms={building.rooms}
      />
      <h2>Комнаты в этом здании:</h2>
      <div className="rooms-list">
        {building.rooms.map(room => (
          <div key={room.id}>
            <RoomCard
              photo={room.photo}
              name={room.name}
              floor={room.floor}
              price={room.price}
              size={room.size}
              internet={room.internet}
              furniture={room.furniture}
              air_conditioning={room.air_conditioning}
              heating={room.heating}
              computer_count={room.computer_count}
              blackboard_simple={room.blackboard_simple}
              blackboard_touchscreen={room.blackboard_touchscreen}
              description={room.description}
              id={room.id}
            />

            <Link to={`/rent/${room.id}`} className="rent-room-link">
              Арендовать комнату
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
