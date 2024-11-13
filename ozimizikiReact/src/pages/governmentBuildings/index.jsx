import { useEffect, useState } from "react";
import BuildingCard from "../../components/BuildingCard";

export default function GovernmentBuildings() {
    const [buildings, setBuildings] = useState([]);

    // Fetch the building data when the component mounts
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/building/")
            .then((response) => response.json())
            .then((data) => setBuildings(data))
            .catch((error) => console.error("Error fetching buildings:", error));
    }, []);
    
    return (
        <div>
            {buildings.map((building) => {
                console.log(building.id); 

                return (
                    <BuildingCard
                        key={building.id}
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
                );
            })}
        </div>
    );
}
