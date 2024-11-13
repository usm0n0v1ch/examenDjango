
import styles from './style.module.css';
import { Link } from 'react-router-dom';
export default function RegAndAuth() {
    return (
        <div className={styles.container}>
            <div className={styles.reg}>
                <Link to='/register' className={styles.title}>
                    Регистрация
                </Link>
            </div>
            <div className={styles.auth}>
                <div className={styles.profileIcon}>
                    <i className="fas fa-user-circle"></i>
                </div>
                <Link to='/login' className={styles.title}>
                    Авторизация
                </Link>
            </div>
            
        </div>
    );
}