import React, { useEffect, useState } from 'react';
import styles from './style.module.css'; 

export default function Governments() {
    const [users, setUsers] = useState([]);  
    const [newUser, setNewUser] = useState({ username: '', role: 'government', password: '' }); 
    const [editingUser, setEditingUser] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);  
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const [searchTerm, setSearchTerm] = useState('');  


    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); 
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message); 
            } finally {
                setLoading(false); 
            }
        };
        fetchUsers();
    }, []);

 
    const filteredUsers = users.filter(user =>
        user.role === 'government' &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  
    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser), 
            });
            if (response.ok) {
                const addedUser = await response.json();
                setUsers((prevUsers) => [...prevUsers, addedUser]);
                setNewUser({ username: '', role: 'government', password: '' }); 
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Ошибка при добавлении пользователя');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteUser = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Ошибка при удалении пользователя');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };


    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/user/${editingUser.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingUser),
            });
            if (response.ok) {
                const updatedUser = await response.json();
                setUsers((prevUsers) => prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
                setIsModalOpen(false);
                setEditingUser(null);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Ошибка при сохранении изменений');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div className={styles.container}>
            <h2>Гос. учреждения</h2>

            <input
                type="text"
                className={styles.searchInput}
                placeholder="Поиск по имени"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />


            <form className={styles.addUserForm} onSubmit={handleAddUser}>
                <input
                    type="text"
                    placeholder="Введите имя"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Введите пароль"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                />
                <button type="submit" disabled={loading}>Добавить</button>
            </form>

            {error && <div style={{ color: 'red' }}>Ошибка: {error}</div>}


            {loading && <div>Загрузка...</div>}

            <ul className={styles.userList}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <li key={user.id}>
                            {user.username}
                            <button onClick={() => handleDeleteUser(user.id)} disabled={loading}>Удалить</button>
                            <button onClick={() => handleEditUser(user)} disabled={loading}>Редактировать</button>
                        </li>
                    ))
                ) : (
                    <li>Нет пользователей с ролью "government"</li>
                )}
            </ul>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Редактировать пользователя</h3>
                        <form onSubmit={handleSaveEdit}>
                            <input
                                type="text"
                                value={editingUser.username}
                                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                value={editingUser.password}
                                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                required
                            />
                            <button type="submit" disabled={loading}>Сохранить изменения</button>
                            <button type="button" className="cancel" onClick={closeModal}>Отмена</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
