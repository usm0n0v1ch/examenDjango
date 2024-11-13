import React, { useEffect, useState } from 'react';
import styles from './style.module.css'; 


const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; 

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default function EditRoomForGovernment() {
    const [rooms, setRooms] = useState([]);  
    const [currentRoom, setCurrentRoom] = useState(null);  
    const [isEditing, setIsEditing] = useState(false);  
    const userId = localStorage.getItem('userId');  


    useEffect(() => {
        if (userId) {
            fetch(`http://127.0.0.1:8000/api/room/?userId=${userId}`)
                .then(response => response.json())
                .then(data => setRooms(data))  
                .catch(error => console.error("Error fetching rooms:", error));
        } else {
            console.log("User ID not found in localStorage.");
        }
    }, [userId]);


    const handleEditClick = (room) => {
        setCurrentRoom(room);  
        setIsEditing(true);  
    };


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (files) {
            setCurrentRoom(prevState => ({
                ...prevState,
                [name]: files[0],
            }));
        } else {
            setCurrentRoom(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();  

       
        Object.keys(currentRoom).forEach(key => {
            formData.append(key, currentRoom[key]);
        });

    
        fetch(`http://127.0.0.1:8000/api/room/${currentRoom.id}/`, {
            method: 'PUT',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Updated room:', data);
            setIsEditing(false); 
            setRooms(prevRooms => prevRooms.map(room => (room.id === data.id ? data : room)));  
        })
        .catch(error => console.error('Error updating room:', error));
    };


    const handleDelete = (roomId) => {
        fetch(`http://127.0.0.1:8000/api/room/${roomId}/`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setRooms(rooms.filter(room => room.id !== roomId));  
                console.log('Room deleted');
            } else {
                console.error('Error deleting room');
            }
        })
        .catch(error => console.error('Error deleting room:', error));
    };

    return (
        <div>
            <h1>Edit Room For Government</h1>
            <div>
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div key={room.id} className={styles.card}>
                            <div className={styles.imgInfo}>
                                <img className={styles.img} src={room.photo} alt={room.name} />
                                <div className={styles.info}>
                                    <div className={styles.name}>{room.name}</div>
                                    <div>Этаж: {room.floor}</div>
                                    <div>Размер: {room.size}</div>
                                    <div>Цена: {room.price}</div>
                                    <div>Интернет: {room.internet ? 'Да' : 'Нет'}</div>
                                    <div>Мебель: {room.furniture ? 'Да' : 'Нет'}</div>
                                    <div>Кондиционер: {room.air_conditioning ? 'Да' : 'Нет'}</div>
                                    <div>Отопление: {room.heating ? 'Да' : 'Нет'}</div>
                                    <div>Количество компьютеров: {room.computer_count}</div>
                                    <div>Доска: {room.blackboard_simple ? 'Да' : 'Нет'}</div>
                                    <div>Электронная доска: {room.blackboard_touchscreen ? 'Да' : 'Нет'}</div>
                                    <div>{room.description}</div>
                                </div>
                            </div>
                            <button onClick={() => handleEditClick(room)}>Редактировать</button>
                            <button onClick={() => handleDelete(room.id)}>Удалить</button>
                        </div>
                    ))
                ) : (
                    <p>Нет доступных комнат.</p>
                )}
            </div>

       
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
                {currentRoom && (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <h2>Редактировать комнату</h2>
                        <div>
                            <label>
                                Название:
                                <input
                                    type="text"
                                    name="name"
                                    value={currentRoom.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Этаж:
                                <input
                                    type="number"
                                    name="floor"
                                    value={currentRoom.floor}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Размер:
                                <input
                                    type="number"
                                    name="size"
                                    value={currentRoom.size}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Цена:
                                <input
                                    type="number"
                                    name="price"
                                    value={currentRoom.price}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Интернет:
                                <input
                                    type="checkbox"
                                    name="internet"
                                    checked={currentRoom.internet}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Мебель:
                                <input
                                    type="checkbox"
                                    name="furniture"
                                    checked={currentRoom.furniture}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Кондиционер:
                                <input
                                    type="checkbox"
                                    name="air_conditioning"
                                    checked={currentRoom.air_conditioning}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Отопление:
                                <input
                                    type="checkbox"
                                    name="heating"
                                    checked={currentRoom.heating}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Количество компьютеров:
                                <input
                                    type="number"
                                    name="computer_count"
                                    value={currentRoom.computer_count}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Описание:
                                <textarea
                                    name="description"
                                    value={currentRoom.description}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Фото:
                                <input
                                    type="file"
                                    name="photo"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <button type="submit">Сохранить изменения</button>
                    </form>
                )}
            </Modal>
        </div>
    );
}
