import { Link } from "react-router-dom";
import styles from './style.module.css';

export default function Use({ text,to }) {
    return (
        <Link to={to} className={styles.container}>
            {text}
        </Link>
    );
}

