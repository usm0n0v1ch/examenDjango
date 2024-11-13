import React, { useState, useEffect } from 'react';
import CreateBuildingModal from "../../components/CreateBuilding";
import EditBuildingModal from "../../components/EditBuildingModal";
import styles from './style.module.css';

export default function Buildings() {
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBuilding, setEditBuilding] = useState(null);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const openEditModal = (building) => {
    setEditBuilding(building);
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditBuilding(null);
  };

  useEffect(() => {
    async function fetchBuildings() {
      try {
        const response = await fetch('http://localhost:8000/api/building/');
        const data = await response.json();
        setBuildings(data);
        setFilteredBuildings(data); 
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }

    fetchBuildings();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = buildings.filter((building) =>
      building.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      building.region.toLowerCase().includes(e.target.value.toLowerCase()) ||
      building.city.toLowerCase().includes(e.target.value.toLowerCase()) ||
      building.street.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBuildings(filtered);
  };


  const deleteBuilding = async (buildingId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/building/${buildingId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Произошла ошибка при удалении здания');
      }

      setBuildings((prevBuildings) => prevBuildings.filter((building) => building.id !== buildingId));
      setFilteredBuildings((prevBuildings) => prevBuildings.filter((building) => building.id !== buildingId)); 
    } catch (error) {
      console.error(error.message || 'Произошла ошибка');
    }
  };

  return (
    <div>
      <h1>Buildings</h1>
      <button onClick={openModal}>Создать здание</button>
      

      <div>
        <input 
          type="text" 
          value={searchQuery} 
          onChange={handleSearch} 
          placeholder="Поиск по названию или адресу..." 
          className={styles.searchInput} 
        />
      </div>
      

      {isModalOpen && <CreateBuildingModal onClose={closeModal} />}
      

      {isEditModalOpen && (
        <div className={`${styles.modalBackdrop} ${isEditModalOpen ? styles.open : ''}`} onClick={closeEditModal}>
          <div className={`${styles.modalContent} ${isEditModalOpen ? styles.open : ''}`} onClick={(e) => e.stopPropagation()}>
            <EditBuildingModal 
              onClose={closeEditModal}
              building={editBuilding}
              setBuildings={setBuildings}
            />
          </div>
        </div>
      )}

      <div className={styles.buildingList}>
        {filteredBuildings.map((building) => (
          <div key={building.id} className={styles.card}>
            <div className={styles.imgInfo}>
              <img className={styles.img} src={building.photo} alt={building.name} />
              <div>
                <div className={styles.info}>
                  <div className={styles.name}>{building.name}</div>
                  <div className={styles.address}>
                    Адрес:
                    <div>{building.region},</div>
                    <div>{building.city},</div>
                    <div>{building.district},</div>
                    <div>{building.street},</div>
                    <div>{building.house}</div>
                  </div>
                  <div>
                    <div>Количество комнат для аренды: {building.rooms.length}</div>
                  </div>
                  <div className={styles.actions}>
                    <button onClick={() => openEditModal(building)} className={styles.editButton}>Редактировать</button>
                    <button onClick={() => deleteBuilding(building.id)} className={styles.deleteButton}>Удалить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
