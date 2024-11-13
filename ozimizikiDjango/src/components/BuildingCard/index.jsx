import Use from "../../UI/Use"; 
import styles from './style.module.css'; 

export default function BuildingCard({ id, photo, name, region, city, district, street, house, rooms }) {
    return (
        <div className={styles.card}>
            <div className={styles.imgInfo}>
                <img className={styles.img} src={photo} alt={name} /> 
                <div>
                    <div className={styles.info}>
                        <div className={styles.name}>{name}</div>
                        <div className={styles.address}>
                            Адрес:
                            <div>{region},</div>
                            <div>{city},</div>
                            <div>{district},</div>
                            <div>{street},</div>
                            <div>{house}</div>
                        </div>
                        <div>
                            <div>Количество комнат для аренды: {rooms.length} </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.btn}>
                <Use text="Подробнее" to={`/detail/${id}`} /> 
            </div>
        </div>
    );
}
