import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './style.module.css';

export default function Options() {
    const [userRole, setUserRole] = useState(null); 
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        if (userId) {

            fetch(`http://127.0.0.1:8000/api/user/${userId}/`)  
                .then(response => response.json())
                .then(data => setUserRole(data.role))  
                .catch(error => console.error("Error fetching user data:", error));
        } else {
            console.log("User ID not found in localStorage.");
        }
    }, [userId]);

    if (userRole === null) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                Главная
            </NavLink>


            {userRole !== 'customer' && (
                <>
                    <NavLink to="/governments" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Гос. учреждения
                    </NavLink>
                    <NavLink to="/buildings" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Здания
                    </NavLink>
                    <NavLink to="/rooms" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Комнаты
                    </NavLink>
                    <NavLink to="/customers" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Клиенты
                    </NavLink>
                    <NavLink to="/rents" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Аренда
                    </NavLink>
                    <NavLink to='/rent-choice' className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Решения аренды
                    </NavLink>
                    <NavLink to='/create-room' className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Создать комнату
                    </NavLink>
                </>
            )}
        </div>
    );
}
