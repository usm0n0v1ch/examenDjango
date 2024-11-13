import React, { useEffect, useState } from 'react';
import RentCard from "../../components/RentCard";
import styles from './style.module.css';

export default function Contract() {
    const [rents, setRents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchRents = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch('http://127.0.0.1:8000/api/rent/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRents(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRents();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Список ваших договоров</div>
            <div className={styles.card}>
                {rents.length > 0 ? (
                    rents.map(rent => (
                        <RentCard key={rent.id} rent={rent} />
                    ))
                ) : (
                    <p>У вас нет активных аренд.</p>
                )}
            </div>
        </div>
    );
}
