
import styles from './style.module.css'

export default function Logo() {
  return (
    <div className={styles.container}>
        <div className={styles.gerbDiv}>
            <img className={styles.gerb} src="public/gerb.png" alt="gerb" />
        </div>
        <div className={styles.name}>
            O'zimiziki
        </div>
    </div>
  )
}