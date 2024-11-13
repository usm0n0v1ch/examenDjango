import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

export default function Customers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
    const [newUser, setNewUser] = useState({ username: '', password: '' }); 
    const [searchQuery, setSearchQuery] = useState(''); 


    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/');
            if (!response.ok) {
                throw new Error('Failed to load users');
            }
            const data = await response.json();
            setUsers(data); 
            setFilteredUsers(data); 
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

  
        const filtered = users.filter(user => 
            user.username.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };


    const handleAddUser = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser), 
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            const addedUser = await response.json();
            setUsers((prevUsers) => [...prevUsers, addedUser]); 
            setFilteredUsers((prevUsers) => [...prevUsers, addedUser]); 
            setIsAddModalOpen(false); 
            setNewUser({ username: '', password: '' });
        } catch (error) {
            setError(error.message);
        }
    };

  
    const handleEditUser = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/user/${selectedUser.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser), 
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const updatedUser = await response.json();
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
            setFilteredUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))); 
            setIsEditModalOpen(false); 
            setSelectedUser(null); 
        } catch (error) {
            setError(error.message);
        }
    };

   
    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); 
            setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); 
        } catch (error) {
            setError(error.message);
        }
    };

    
    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

   
    const handleOpenEditModal = (user) => {
        setSelectedUser(user); 
        setIsEditModalOpen(true);
    };

    
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null); 
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className={styles.customersContainer}>
            <h2>Клиенты</h2>

            <input
                type="text"
                placeholder="Поиск пользователей"
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />

            <button onClick={handleOpenAddModal} className={styles.openModalButton}>
                Добавить пользователя
            </button>

           
            {isAddModalOpen && (
                <div className={styles.modal}>
                    <h3>Добавить пользователя</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
                        <input
                            type="text"
                            placeholder="Имя пользователя"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                        />
                        <button type="submit">Добавить</button>
                        <button type="button" onClick={handleCloseAddModal}>Закрыть</button>
                    </form>
                </div>
            )}

         
            {isEditModalOpen && selectedUser && (
                <div className={styles.modal}>
                    <h3>Редактировать пользователя</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleEditUser(); }}>
                        <input
                            type="text"
                            value={selectedUser.username}
                            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            value={selectedUser.password}
                            onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                            required
                        />
                        <button type="submit">Сохранить</button>
                        <button type="button" onClick={handleCloseEditModal}>Закрыть</button>
                    </form>
                </div>
            )}

            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}

            <div className={styles.usersList}>
                {filteredUsers.length === 0 ? (
                    <div>Нет пользователей.</div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user.id} className={styles.card}>
                            <div className={styles.info}>
                                <div>Имя пользователя: {user.username}</div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    onClick={() => handleOpenEditModal(user)} 
                                    className={styles.editButton}
                                >
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)} 
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
