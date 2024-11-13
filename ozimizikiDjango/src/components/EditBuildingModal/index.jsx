import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

export default function EditBuildingModal({ onClose, building, setBuildings }) {
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

  useEffect(() => {
 
    const fetchData = async () => {
      try {
        const userResponse = await fetch('http://localhost:8000/api/user/');
        const roomResponse = await fetch('http://localhost:8000/api/room/');

        if (!userResponse.ok || !roomResponse.ok) {
          throw new Error('Не удалось загрузить данные');
        }

        const usersData = await userResponse.json();
        const roomsData = await roomResponse.json();

        setUsers(usersData);
        setRooms(roomsData);

        if (building) {
          setFormData({
            ...building,
            user: building.user.id,  
            rooms: building.rooms.map((room) => room.id),  
          });
        }
      } catch (error) {
        alert(error.message || 'Произошла ошибка при загрузке данных');
      }
    };

    fetchData();
  }, [building]);

  const handleChange = (e) => {
    const { name, value, type, files, options } = e.target;
    if (type === 'file') {
      setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
    } else if (type === 'select-multiple') {
      const selectedValues = Array.from(options, option => option.value);
      setFormData((prevState) => ({ ...prevState, [name]: selectedValues }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
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
      const buildingId = building.id;
      const response = await fetch(`http://localhost:8000/api/buildings/${buildingId}/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: data,
      });

      const updatedBuilding = await response.json();
      if (!response.ok) {
        throw new Error(updatedBuilding.message || 'Произошла ошибка');
      }

      setBuildings((prevBuildings) =>
        prevBuildings.map((b) => (b.id === updatedBuilding.id ? updatedBuilding : b))
      );

      onClose();
      alert('Здание успешно обновлено!');
    } catch (error) {
      alert(error.message || 'Произошла ошибка');
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.close} onClick={onClose}>×</button>
        <h2 className={styles.title}>Редактировать здание</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Название</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Введите название"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              placeholder="Введите описание"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="photo">Фото</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="region">Регион</label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="district">Район</label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">Город</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="street">Улица</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="house">Дом</label>
            <input
              type="text"
              id="house"
              name="house"
              value={formData.house}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="floor_count">Количество этажей</label>
            <input
              type="number"
              id="floor_count"
              name="floor_count"
              value={formData.floor_count}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="room_count">Количество комнат</label>
            <input
              type="number"
              id="room_count"
              name="room_count"
              value={formData.room_count}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="area">Площадь</label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rooms">Комнаты</label>
            <select
              id="rooms"
              name="rooms"
              multiple
              value={formData.rooms}
              onChange={handleChange}
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="user">Пользователь</label>
            <select
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Сохранить изменения
          </button>
        </form>
      </div>
    </div>
  );
}
