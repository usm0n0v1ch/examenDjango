import { Link } from "react-router-dom";
import styles from './style.module.css';



export default function Back({to}) {
    return (
        <Link to={to} className={styles.container}>
            Назад
        </Link>
    );
}