import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoomCard from '../../components/RoomCard';

export default function Rent() {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [price, setPrice] = useState('');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/room/${roomId}/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRoom(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, [roomId]);

    const calculateDaysBetweenDates = (start, end) => {
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        const timeDifference = endDateObj - startDateObj;
        const dayInMilliseconds = 1000 * 60 * 60 * 24;
        return timeDifference / dayInMilliseconds;
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        if (endDate) {
            const days = calculateDaysBetweenDates(newStartDate, endDate);
            if (days >= 0) {
                const monthlyPrice = room?.price || 0;
                const dailyPrice = monthlyPrice / 30;
                setPrice(Math.round(dailyPrice * days));
            }
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);

        if (startDate) {
            const days = calculateDaysBetweenDates(startDate, newEndDate);
            if (days >= 0) {
                const monthlyPrice = room?.price || 0;
                const dailyPrice = monthlyPrice / 30;
                setPrice(Math.round(dailyPrice * days)); 
            }
        }
    };

    const handleRent = async () => {
        if (!startDate || !endDate || !price) {
            alert('Please fill in all fields');
            return;
        }

        const rentData = {
            user: userId,
            room: room.id,
            start_date: startDate,
            end_date: endDate,
            price: price,
            status: 'ожидается ответ' 
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/rent/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(rentData),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Room rented successfully!');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert(`Failed to rent the room: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!room) {
        return <div>No room found</div>;
    }

    return (
        <div>
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
                description={room.description}
                id={room.id}
            />

            <h2>Rent a Room</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </div>
                <div>
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="text"
                        value={price}
                        readOnly
                        disabled
                    />
                </div>
                <button type="button" onClick={handleRent}>
                    Rent the Room
                </button>
            </form>
        </div>
    );
}
