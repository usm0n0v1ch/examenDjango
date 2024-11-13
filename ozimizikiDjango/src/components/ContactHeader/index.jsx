
import styles from './style.module.css'

export default function ContactHeader() {
    return (
        <div className={styles.container}>
            <i className={`fas fa-phone ${styles.phoneIcon}`}></i>
            <div className={styles.phoneAndTime}>
                <div className={styles.phone}>
                    +998-71-123-45-67
                </div>
                <div className={styles.time}>
                    24/7
                </div>
            </div>


        </div>
    )
}