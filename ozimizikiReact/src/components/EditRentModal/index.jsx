import React, { useState, useEffect } from 'react';
import styles from './style.module.css'; 

export default function EditRentModal({ rent, onClose, onUpdate }) {
    const [editRent, setEditRent] = useState(rent);


    useEffect(() => {
        setEditRent(rent);
    }, [rent]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditRent((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/rent/${editRent.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editRent),
            });
            if (!response.ok) {
                throw new Error('Ошибка при обновлении аренды');
            }
            onUpdate(); 
            onClose(); 
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>❌</button>
                <h3 className={styles.header}>Редактировать аренду</h3>
                <form onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        Пользователь:
                        <input
                            type="text"
                            name="user"
                            value={editRent.user}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </label>
                    <label className={styles.label}>
                        Комната:
                        <input
                            type="text"
                            name="room"
                            value={editRent.room}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </label>
                    <label className={styles.label}>
                        Дата начала:
                        <input
                            type="date"
                            name="start_date"
                            value={editRent.start_date}
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
                            value={editRent.end_date}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </label>
                    <label className={styles.label}>
                        Статус:
                        <select
                            name="status"
                            value={editRent.status}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="ожидается ответ">Ожидается ответ</option>
                            <option value="принят">Принят</option>
                            <option value="отклонен">Отклонен</option>
                        </select>
                    </label>
                    <button type="submit" className={styles.submitButton}>Обновить аренду</button>
                    <button type="button" onClick={onClose} className={styles.cancelButton}>Отмена</button>
                </form>
            </div>
        </div>
    );
}
