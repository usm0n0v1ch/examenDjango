import React, { useState, useEffect } from 'react';
import RoomCard from '../RoomCard';
import styles from './style.module.css';


export default function RentCard({ rent }) {
    const [room, setRoom] = useState(null);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/room/${rent.room}/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRoom(data);
            } catch (error) {
                console.error('Failed to fetch room details:', error);
            }
        };

        fetchRoomDetails();
    }, [rent.room]);

    return (
        <div className={styles.card}>
            <div className={styles.rentInfo}>
                <div className={styles.rentDetail}>
                    <div className={styles.rentDetailText}>Номер договора:</div>
                    <div>{rent.id}</div>
                </div>
                <div className={styles.rentDetail}>
                    <div className={styles.rentDetailText}>Дата начала:</div>
                    <div>{rent.start_date}</div>
                </div>
                <div className={styles.rentDetail}>
                    <div className={styles.rentDetailText}>Дата окончания: </div>
                    <div>{rent.end_date}</div>
                </div>
                <div className={styles.rentDetail}>
                    <div className={styles.rentDetailText}>Цена:</div>
                    <div>{rent.price} sum</div>
                </div>
                <div className={styles.rentDetail}>
                    <div className={styles.rentDetailText}>Статус: </div>
                    <div>{rent.status}</div>
                </div>
            </div>
            
            <div>
                {room ? (
                    <RoomCard
                        photo={room.photo}
                        name={room.name}
                        floor={room.floor}
                        size={room.size}
                        price={room.price}
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
                ) : (
                    <p>Загружаем данные о комнате...</p>
                )}
            </div>
            
        </div>
    );
}
