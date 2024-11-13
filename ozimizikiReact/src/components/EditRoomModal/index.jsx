import React, { useState, useEffect } from 'react';
import styles from './style.module.css'; 

export default function EditRoomModal({ room, onClose, setRooms, onRoomUpdated }) {
    const [formData, setFormData] = useState({
        name: room.name || '',
        description: room.description || '',
        photo: room.photo || '', 
        floor: room.floor || '',
        size: room.size || '',
        price: room.price || '',
        internet: room.internet || false,
        furniture: room.furniture || false,
        air_conditioning: room.air_conditioning || false,
        heating: room.heating || false,
        computer_count: room.computer_count || '',
        blackboard_simple: room.blackboard_simple || false,
        blackboard_touchscreen: room.blackboard_touchscreen || false,
        busy: room.busy || false,
        user: room.user || '', 
    });

    const [preview, setPreview] = useState(null); 
    const [users, setUsers] = useState([]); 
    const [loadingUsers, setLoadingUsers] = useState(true); 

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/');
                if (!response.ok) {
                    throw new Error('Не удалось загрузить пользователей');
                }
                const data = await response.json();
                
                const governmentUsers = data.filter(user => user.role === 'government');
                
                setUsers(governmentUsers); 
                setLoadingUsers(false);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (formData.photo) {
            setPreview(formData.photo); 
        }
    }, [formData.photo]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file); 
            setFormData((prevData) => ({
                ...prevData,
                photo: file, 
            }));
            setPreview(fileUrl); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("floor", formData.floor);
        formDataToSend.append("size", formData.size);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("internet", formData.internet);
        formDataToSend.append("furniture", formData.furniture);
        formDataToSend.append("air_conditioning", formData.air_conditioning);
        formDataToSend.append("heating", formData.heating);
        formDataToSend.append("computer_count", formData.computer_count);
        formDataToSend.append("blackboard_simple", formData.blackboard_simple);
        formDataToSend.append("blackboard_touchscreen", formData.blackboard_touchscreen);
        formDataToSend.append("busy", formData.busy);
        formDataToSend.append("user", formData.user);

        if (formData.photo) {
            formDataToSend.append("photo", formData.photo); 
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/room/${room.id}/`, {
                method: 'PUT',
                headers: {

                },
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(`Не удалось обновить комнату: ${errorText}`);
            }

            const updatedRoomData = await response.json();
            setRooms((prevRooms) =>
                prevRooms.map((r) => (r.id === room.id ? updatedRoomData : r))
            );
            onRoomUpdated(); 
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h2>Редактировать комнату</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Название:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="description">Описание:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="photo">Фото:</label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            onChange={handleFileChange}
                            accept="image/*" 
                        />
                       
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="floor">Этаж:</label>
                        <input
                            type="number"
                            id="floor"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="size">Размер (м²):</label>
                        <input
                            type="number"
                            id="size"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="price">Цена:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>
                            <input
                                type="checkbox"
                                name="internet"
                                checked={formData.internet}
                                onChange={handleChange}
                            />
                            Интернет
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="furniture"
                                checked={formData.furniture}
                                onChange={handleChange}
                            />
                            Мебель
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="air_conditioning"
                                checked={formData.air_conditioning}
                                onChange={handleChange}
                            />
                            Кондиционер
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="heating"
                                checked={formData.heating}
                                onChange={handleChange}
                            />
                            Отопление
                        </label>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="computer_count">Количество компьютеров:</label>
                        <input
                            type="number"
                            id="computer_count"
                            name="computer_count"
                            value={formData.computer_count}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>
                            <input
                                type="checkbox"
                                name="blackboard_simple"
                                checked={formData.blackboard_simple}
                                onChange={handleChange}
                            />
                            Обычная доска
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="blackboard_touchscreen"
                                checked={formData.blackboard_touchscreen}
                                onChange={handleChange}
                            />
                            Сенсорная доска
                        </label>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="user">Пользователь:</label>
                        <select
                            id="user"
                            name="user"
                            value={formData.user}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите пользователя</option>
                            {loadingUsers ? (
                                <option value="">Загрузка...</option>
                            ) : (
                                users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <button type="submit" className={styles.submitButton}>Сохранить изменения</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
