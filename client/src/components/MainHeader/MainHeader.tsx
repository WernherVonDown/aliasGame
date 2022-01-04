import React, { useContext } from "react";
import { Button } from "react-materialize";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import Header from "../Header/Header";
import styles from './MainHeader.module.scss';

const MainHeader = () => {
    const history = useHistory();
    const { state: authState, actions: { logout } } = useContext(AuthContext)
    return (
        <Header>
            <div className={styles.headerLeft}>
                <div className={styles.headerLogo}>AliasGame</div>
            </div>
            {
                authState.loggedIn && <div className={styles.rightBtnsWrapper}>
                    {authState.username}
                    <Button
                        onClick={logout}
                        flat
                        className={styles.btn}
                    >
                        Выйти
                    </Button>
                </div>
            }
            {!authState.loggedIn && <div className={styles.rightBtnsWrapper}>
                <Button
                    onClick={() => history.push('/registration')}
                    flat
                    className={styles.btn}
                >
                    Регистрация
                </Button>
                <Button
                    onClick={() => history.push('/login')}
                    flat
                    className={styles.btn}
                >
                    Войти
                </Button>
            </div>}
        </Header>
    )
}

export default MainHeader;