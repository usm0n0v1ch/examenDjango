import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

export default function CreateRoomModal({ onClose }) {
  const [formData, setFormData] = useState({
    user: '',
    name: '',
    photo: null,
    floor: '',
    size: '',
    internet: false,
    furniture: false,
    air_conditioning: false,
    heating: false,
    computer_count: '',
    blackboard_simple: false,
    blackboard_touchscreen: false,
    description: '',
    price: '',
    busy: false,
  });

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {

    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:8000/api/user/');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Ошибка при загрузке пользователей.');
      }
    }

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData((prevState) => ({ ...prevState, [name]: checked }));
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
      if (formData[key] instanceof Array) {
        formData[key].forEach((item) => {
          data.append(key, item);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:8000/api/room/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: data,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Произошла ошибка');
      }

      setSuccessMessage('Комната успешно создана!');
      setFormData({
        user: '',
        name: '',
        photo: null,
        floor: '',
        size: '',
        internet: false,
        furniture: false,
        air_conditioning: false,
        heating: false,
        computer_count: '',
        blackboard_simple: false,
        blackboard_touchscreen: false,
        description: '',
        price: '',
        busy: false,
      });
    } catch (error) {
      setError(error.message || 'Произошла ошибка');
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.close} onClick={onClose}>×</button>
        <h2 className={styles.title}>Создать комнату</h2>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.column}>
              <select
                name="user"
                value={formData.user}
                onChange={handleChange}
                required
                className={styles.input}
              >
                <option value="">Выберите пользователя</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Название комнаты"
              />
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Этаж"
              />
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Размер"
              />
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className={styles.inputFile}
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className={styles.textarea}
                placeholder="Описание"
              />
            </div>
            <div className={styles.column}>
              <input
                type="number"
                name="computer_count"
                value={formData.computer_count}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Количество компьютеров"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Цена"
              />
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
                <label>
                  <input
                    type="checkbox"
                    name="blackboard_simple"
                    checked={formData.blackboard_simple}
                    onChange={handleChange}
                  />
                  Простая доска
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
              <label>
                <input
                  type="checkbox"
                  name="busy"
                  checked={formData.busy}
                  onChange={handleChange}
                />
                Занято
              </label>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            Создать комнату
          </button>
        </form>
      </div>
    </div>
  );
}
