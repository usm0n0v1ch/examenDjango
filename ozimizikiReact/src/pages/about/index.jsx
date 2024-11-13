import { FaBuilding, FaChalkboardTeacher, FaGraduationCap, FaFutbol } from 'react-icons/fa';
import styles from './style.module.css';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <div>
                    O'zimiziki
                </div>
                <div>
                    O’zimiziki—крупный маркетплейс, предназначенный для 
                    взаимодействия между бюджетными организациями и получателями 
                    услуг или товаров.
                </div>
            </div>
            <Link to="/government-buildings" className={styles.option}>
                <div className={styles.iconContainer}>
                    <FaBuilding size={50} color="black" />
                    <div>Аренда: государственные учреждения</div>
                </div>
                <Link to="/government-buildings" className={styles.link}><div className={styles.use}>Воспользоваться</div></Link>
            </Link>
            <Link className={styles.option}>
                <div className={styles.iconContainer}>
                    <FaChalkboardTeacher size={50} color="black" />
                    <div>Консалтинговые услуги</div>
                </div>
                <div className={styles.use}>Воспользоваться</div>
            </Link>
            <Link className={styles.option}>
                <div className={styles.iconContainer}>
                    <FaGraduationCap size={50} color="black" />
                    <div>Образовательные услуги</div>
                </div>
                <div className={styles.use}>Воспользоваться</div>
            </Link>
            <Link className={styles.option}>
                <div className={styles.iconContainer}>
                    <FaFutbol size={50} color="black" />
                    <div>Спортивные площадки</div>
                </div>
                <div className={styles.use}>Воспользоваться</div>
            </Link>
        </div>
    );
}
