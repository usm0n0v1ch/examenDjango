
import styles from './style.module.css'
import { Link } from 'react-router-dom';
export default function Basket() {
    return (
        <Link to="/contract" className={styles.container}>
            <i className="fas fa-file-contract"></i>
            <div>Ваши договора</div>
        </Link>
    );
}