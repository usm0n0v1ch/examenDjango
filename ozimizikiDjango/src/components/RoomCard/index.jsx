import Use from "../../UI/Use";
import React from "react";
import styles from './style.module.css';

export default function RoomCard({
    photo, name, floor, size, price, internet, furniture, air_conditioning, heating,
    computer_count, blackboard_simple, blackboard_touchscreen, description, id
}) {
    return (
        <div className={styles.card}>
            <div className={styles.imgInfo}>
                <img className={styles.img} src={photo} alt={name}></img>
                <div className={styles.info}>
                    <div className={styles.name}>{name}</div>
                    <div>Этаж: {floor}</div>
                    <div>Размер: {size}</div>
                    <div>Цена: {price}</div>
                </div>
            </div>

            <div>
                <div>Интернет: {internet ? 'Да' : 'Нет'}</div>
                <div>Мебель: {furniture ? 'Да' : 'Нет'}</div>
                <div>Кондиционер: {air_conditioning ? 'Да' : 'Нет'}</div>
                <div>Отопление: {heating ? 'Да' : 'Нет'}</div>
                <div>Количество компьютеров: {computer_count}</div>
                <div>Доска: {blackboard_simple ? 'Да' : 'Нет'}</div>
                <div>Электронная доска: {blackboard_touchscreen ? 'Да' : 'Нет'}</div>
            </div>
            <div>
                <div>{description}</div>
            </div>
            <div>
                <Use text="Арендовать" to={`/rent/${id}`}/>
            </div>
        </div>
    );
}
