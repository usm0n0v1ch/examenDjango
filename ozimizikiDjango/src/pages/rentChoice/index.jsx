import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

export default function RentChoice() {
    const [rents, setRents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRents = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/rent/');
            if (!response.ok) {
                throw new Error('Failed to load rents');
            }
            const data = await response.json();
            
            const rentsWithDetails = await Promise.all(data.map(async (rent) => {
                const roomResponse = await fetch(`http://127.0.0.1:8000/api/room/${rent.room}`);
                const userResponse = await fetch(`http://127.0.0.1:8000/api/user/${rent.user}`);
                
                if (!roomResponse.ok || !userResponse.ok) {
                    throw new Error('Failed to load room or user data');
                }

                const roomData = await roomResponse.json();
                const userData = await userResponse.json();

                return {
                    ...rent,
                    roomName: roomData.name,
                    userUsername: userData.username,
                    roomPrice: roomData.price,
                    rentStartDate: rent.start_date,
                    rentEndDate: rent.end_date,
                    rentCreatedAt: rent.created_at,
                };
            }));

            setRents(rentsWithDetails);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRents();
    }, []);

    const updateRentStatus = async (rentId, newStatus) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/rent/${rentId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update rent status');
            }

            const updatedRent = await response.json();

            setRents((prevRents) =>
                prevRents.map((rent) => 
                    rent.id === updatedRent.id ? { ...rent, status: updatedRent.status } : rent
                )
            );
        } catch (error) {
            console.error('Error updating rent status:', error);
        }
    };

    const handleStatusChange = (rentId, newStatus) => {
        if (newStatus !== 'ожидается ответ') {
            updateRentStatus(rentId, newStatus);
        }
    };

    return (
        <div className={styles.rentChoiceContainer}>
            <h2>Аренды</h2>

            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}

            <div className={styles.rentsList}>
                {rents.length === 0 ? (
                    <div>Нет аренды.</div>
                ) : (
                    rents.map((rent) => (
                        <div key={rent.id} className={styles.card}>
                            <div className={styles.info}>
                                <div>Room: {rent.roomName}</div>
                                <div>User: {rent.userUsername}</div>
                                <div>Status: {rent.status}</div>
                                <div>Price: {rent.roomPrice} ₽</div>
                                <div>Start Date: {new Date(rent.rentStartDate).toLocaleDateString()}</div>
                                <div>End Date: {new Date(rent.rentEndDate).toLocaleDateString()}</div>
                                <div>Created At: {new Date(rent.rentCreatedAt).toLocaleString()}</div>
                            </div>

                            <div className={styles.actions}>
                                <select
                                    value={rent.status}
                                    onChange={(e) => handleStatusChange(rent.id, e.target.value)}
                                    className={styles.statusSelect}
                                >
                                    <option value="принят">Принят</option>
                                    <option value="отклонен">Отклонен</option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
