import { useEffect, useState } from "react";
import styles from './style.module.css';

export default function CreateRent({ onClose }) {
    const [rent, setRent] = useState({
        user: '',
        room: '',
        start_date: '',
        end_date: '',
        price: 0,
        status: 'ожидается ответ', 
    });
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);
    const [monthlyPrice, setMonthlyPrice] = useState(0);


    const statuses = [
        { value: 'ожидается ответ', label: 'Ожидается ответ' },
        { value: 'принят', label: 'Принят' },
        { value: 'отклонен', label: 'Отклонен' },
    ];

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/');
            if (!response.ok) {
                throw new Error('Ошибка при загрузке списка пользователей');
            }
            const data = await response.json();

            const customers = data.filter(user => user.role === 'customer');
            setUsers(customers);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/room/');
            if (!response.ok) {
                throw new Error('Ошибка при загрузке списка комнат');
            }
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const calculatePrice = async (roomId, startDate, endDate) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/room/${roomId}/`);
            if (!response.ok) {
                throw new Error('Ошибка при расчете стоимости аренды');
            }
            const data = await response.json();
            setMonthlyPrice(data.price);

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);

                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                const dailyPrice = data.price / 30;
                const totalPrice = Math.round(diffDays * dailyPrice);

                setRent(prevRent => ({ ...prevRent, price: totalPrice }));
            } else {
                setRent(prevRent => ({ ...prevRent, price: 0 }));
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRooms();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setRent(prevRent => ({ ...prevRent, [name]: value }));

        if (name === 'room' || name === 'start_date' || name === 'end_date') {
            calculatePrice(
                name === 'room' ? value : rent.room,
                name === 'start_date' ? value : rent.start_date,
                name === 'end_date' ? value : rent.end_date
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/rents/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rent),
            });
            if (!response.ok) {
                throw new Error('Ошибка при создании аренды');
            }
            
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                
                <button className={styles.closeButton} onClick={onClose}>&#10006;</button>
                <h2>Создать аренду</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                        Пользователь:
                        <select
                            name="user"
                            value={rent.user}
                            onChange={handleChange}
                            required
                            className={styles.select}
                        >
                            <option value="">Выберите пользователя</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.label}>
                        Комната:
                        <select
                            name="room"
                            value={rent.room}
                            onChange={handleChange}
                            required
                            className={styles.select}
                        >
                            <option value="">Выберите комнату</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.label}>
                        Дата начала:
                        <input
                            type="date"
                            name="start_date"
                            value={rent.start_date}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </label>
                    <label className={styles.label}>
                        Дата окончания:
                        <input
                            type="date"
                            name="end_date"
                            value={rent.end_date}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </label>
                    <label className={styles.label}>
                        Статус аренды:
                        <select
                            name="status"
                            value={rent.status}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <p className={styles.priceText}>Цена аренды: {rent.price}</p>
                    <button type="submit" className={styles.button}>Создать аренду</button>
                </form>
            </div>
        </div>
    );
}
