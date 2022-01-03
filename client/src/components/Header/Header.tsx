import React from "react";
import styles from './Header.module.scss';

interface IProps {
    children: any
}

const Header = ({children}: IProps) => {
    return <div className={styles.header}>
        {children}
    </div>
}

export default Header;