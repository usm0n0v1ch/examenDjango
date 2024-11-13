import React, { useState, useEffect } from 'react';
import CreateRoomModal from "../../components/CreateRoom";
import EditRoomModal from "../../components/EditRoomModal";
import styles from './style.module.css';

export default function Rooms() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenEditModal = (room) => {
        setSelectedRoom(room);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedRoom(null);
    };

    const fetchRooms = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/room/');
            if (!response.ok) throw new Error('Failed to load rooms');
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleRoomUpdated = () => {
        fetchRooms();
        handleCloseEditModal();
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/room/${roomId}/`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete room');
            setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
        } catch (error) {
            console.error('Error deleting room:', error);
            setError(error.message);
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.roomsContainer}>
            <button className={styles.openModalButton} onClick={handleOpenModal}>
                Create Room
            </button>

            {isModalOpen && <CreateRoomModal onClose={handleCloseModal} />}
            {isEditModalOpen && (
                <EditRoomModal
                    room={selectedRoom}
                    onClose={handleCloseEditModal}
                    setRooms={setRooms}
                    onRoomUpdated={handleRoomUpdated}
                />
            )}

            <input
                type="text"
                placeholder="Поиск комнат..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />

            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}

            <div className={styles.roomsList}>
                {filteredRooms.length === 0 ? (
                    <div>No rooms match your search.</div>
                ) : (
                    filteredRooms.map((room) => (
                        <div key={room.id} className={styles.card}>
                            <div className={styles.imgInfo}>
                                <img className={styles.img} src={room.photo} alt={room.name} />
                                <div className={styles.info}>
                                    <div className={styles.name}>{room.name}</div>
                                    <div>Floor: {room.floor}</div>
                                    <div>Size: {room.size} m²</div>
                                    <div>Price: {room.price} ₽</div>
                                </div>
                            </div>

                            <div className={styles.features}>
                                <div>Internet: {room.internet ? 'Yes' : 'No'}</div>
                                <div>Furniture: {room.furniture ? 'Yes' : 'No'}</div>
                                <div>Air Conditioning: {room.air_conditioning ? 'Yes' : 'No'}</div>
                                <div>Heating: {room.heating ? 'Yes' : 'No'}</div>
                                <div>Computer Count: {room.computer_count}</div>
                                <div>Blackboard: {room.blackboard_simple ? 'Yes' : 'No'}</div>
                                <div>Smartboard: {room.blackboard_touchscreen ? 'Yes' : 'No'}</div>
                            </div>

                            <div className={styles.description}>
                                <p>{room.description}</p>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    onClick={() => handleOpenEditModal(room)}
                                    className={styles.editButton}
                                >
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => handleDeleteRoom(room.id)}
                                    className={styles.deleteButton}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
