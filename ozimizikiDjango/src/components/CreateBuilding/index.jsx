import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

export default function CreateBuildingModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photo: null,
    region: '',
    district: '',
    city: '',
    street: '',
    house: '',
    floor_count: '',
    room_count: '',
    area: '',
    rooms: [],
    user: ''
  });

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    async function fetchUsersAndRooms() {
      try {
        const usersResponse = await fetch('http://localhost:8000/api/user/');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const roomsResponse = await fetch('http://localhost:8000/api/room/');
        const roomsData = await roomsResponse.json();
        setRooms(roomsData);
      } catch (error) {
        setError('Ошибка при загрузке данных.');
      }
    }

    fetchUsersAndRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
    } else if (type === 'select-multiple') {
      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
      setFormData((prevState) => ({ ...prevState, [name]: selectedValues }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Вы не авторизованы. Пожалуйста, войдите в систему.');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => {
          data.append(key, item);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:8000/api/buildings/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: data,
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText);
      }

      setSuccessMessage('Здание успешно добавлено!');
      setFormData({
        name: '',
        description: '',
        photo: null,
        region: '',
        district: '',
        city: '',
        street: '',
        house: '',
        floor_count: '',
        room_count: '',
        area: '',
        rooms: [],
        user: ''
      });
    } catch (error) {
      setError(error.message || 'Произошла ошибка');
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.close} onClick={onClose}>×</button>
        <h2 className={styles.title}>Добавить здание</h2>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.column}>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className={styles.input} 
                placeholder="Название" 
              />
              <input 
                type="text" 
                name="region" 
                value={formData.region} 
                onChange={handleChange} 
                required 
                className={styles.input} 
                placeholder="Регион" 
              />
              <input 
                type="text" 
                name="street" 
                value={formData.street} 
                onChange={handleChange} 
                required 
                className={styles.input} 
                placeholder="Улица" 
              />
              <input 
                type="number" 
                name="floor_count" 
                value={formData.floor_count} 
                onChange={handleChange} 
                required 
                className={styles.input} 
                placeholder="Этажи" 
              />
              <input 
                type="number" 
                name="area" 
                value={formData.area} 
                onChange={handleChange} 
                required 
                className={styles.input} 
                placeholder="Площадь" 
              />
            </div>
            <div className={styles.column}>
              <input 
                type="text" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                className={styles.textarea} 
                placeholder="Описание" 
              />
              <input 
                type="file" 
                name="photo" 
                onChange={handleChange} 
                required 
                className={styles.inputFile} 
                placeholder="Фото" 
              />
              <input 
                type="text" 
                name="district" 
                value={formData.district} 
                onChange={handleChange} 
                className={styles.input} 
                placeholder="Район" 
              />
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                required 
                className={styles.input} 
                placeholder="Город" 
              />
              <input 
                type="text" 
                name="house" 
                value={formData.house} 
                onChange={handleChange} 
                required 
                className={styles.input} 
                placeholder="Дом" 
              />
              <input 
                type="number" 
                name="room_count" 
                value={formData.room_count} 
                onChange={handleChange} 
                required 
                className={styles.input} 
                placeholder="Комнаты" 
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <select 
              name="rooms" 
              multiple 
              value={formData.rooms} 
              onChange={handleChange} 
              required 
              className={styles.select} 
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <select 
              name="user" 
              value={formData.user} 
              onChange={handleChange} 
              required 
              className={styles.select} 
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.submitButton}>Создать</button>
        </form>
      </div>
    </div>
  );
}
