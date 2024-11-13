import React, { useState, useEffect } from 'react';
import CreateRent from "../../components/CreateRent";
import EditRentModal from "../../components/EditRentModal";
import styles from './style.module.css';

export default function Rents() {
    const [rents, setRents] = useState([]);
    const [filteredRents, setFilteredRents] = useState([]);
    const [error, setError] = useState(null);
    const [selectedRent, setSelectedRent] = useState(null);
    const [isCreateRentOpen, setIsCreateRentOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchRents = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/rent/');
            if (!response.ok) {
                throw new Error('Ошибка при загрузке списка аренды');
            }
            const rentsData = await response.json();

            const rentsWithDetails = await Promise.all(rentsData.map(async (rent) => {
                const userResponse = await fetch(`http://127.0.0.1:8000/api/user/${rent.user}/`);
                const roomResponse = await fetch(`http://127.0.0.1:8000/api/room/${rent.room}/`);
                
                const userData = userResponse.ok ? await userResponse.json() : { username: 'Неизвестный пользователь' };
                const roomData = roomResponse.ok ? await roomResponse.json() : { name: 'Неизвестная комната' };
                
                return {
                    ...rent,
                    user: userData.username,
                    room: roomData.name,
                };
            }));

            setRents(rentsWithDetails);
            setFilteredRents(rentsWithDetails);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        if (query === '') {
            setFilteredRents(rents);
            return;
        }

        const filtered = rents.filter(rent => {
            const userMatch = rent.user?.toLowerCase().includes(query);
            const roomMatch = rent.room?.toLowerCase().includes(query);
            const statusMatch = rent.status?.toLowerCase().includes(query);
            return userMatch || roomMatch || statusMatch;
        });

        setFilteredRents(filtered);
    };

    const handleDeleteRent = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/rent/${id}/`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Ошибка при удалении аренды');
            }
            fetchRents();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditRent = (rent) => {
        setSelectedRent(rent);
    };

    const handleOpenCreateRent = () => {
        setIsCreateRentOpen(true);
    };

    const handleCloseCreateRent = () => {
        setIsCreateRentOpen(false);
        fetchRents();
    };

    const handleCloseEditRent = () => {
        setSelectedRent(null);
    };

    useEffect(() => {
        fetchRents();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Список аренды</h2>

            <input
                type="text"
                className={styles.searchInput}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Поиск по пользователю, комнате или статусу"
            />

            <button onClick={handleOpenCreateRent} className={styles.addRentButton}>
                Добавить аренду
            </button>

            {isCreateRentOpen && (
                <CreateRent 
                    onClose={handleCloseCreateRent} 
                    onUpdate={fetchRents} 
                />
            )}

            {selectedRent && (
                <EditRentModal
                    rent={selectedRent}
                    onClose={handleCloseEditRent}
                    onUpdate={fetchRents}
                />
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul className={styles.rentList}>
                {filteredRents.map(rent => (
                    <li key={rent.id} className={styles.rentItem}>
                        <div><strong>Пользователь:</strong> {rent.user}</div>
                        <div><strong>Комната:</strong> {rent.room}</div>
                        <div><strong>Дата начала:</strong> {rent.start_date}</div>
                        <div><strong>Дата окончания:</strong> {rent.end_date}</div>
                        <div><strong>Цена аренды:</strong> {rent.price} ₽</div>
                        <div><strong>Статус:</strong> {rent.status}</div>
                        <button onClick={() => handleEditRent(rent)} className={styles.editButton}>Редактировать</button>
                        <button onClick={() => handleDeleteRent(rent.id)} className={styles.deleteButton}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
