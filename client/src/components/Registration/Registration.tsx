import React, { useContext, useEffect } from "react";
import { Button, TextInput } from "react-materialize";
import { useHistory } from "react-router-dom";
import MainHeader from "../MainHeader/MainHeader";
import styles from './Registration.module.scss';
import useInput from '../../hooks/useInput';
import { AuthContext } from "../../context/auth.context";

const Registration = () => {
    const { actions: authActions, state: authState } = useContext(AuthContext);
    const history = useHistory();
    const email = useInput('');
    const pass1 = useInput('');
    const pass2 = useInput('');
    const login = useInput('');

    useEffect(() => {
        if (authState.loggedIn) {
            history.push('/')
        }
    }, [authState.loggedIn])

    const send = () => {
        if (!email.value.length || !login.value.length || !pass1.value.length) {
            return alert('Заполните все поля')
        }

        if (pass1.value !== pass2.value) {
            return alert('Пароли не совпадают')
        }

        authActions.register(login.value, email.value, pass2.value);
    }
    // const []
    return <div className={styles.content}>
        <MainHeader />
        <div className={styles.formWrapper}>
            <div className={styles.titleText}>Регистрация</div>
            <div className="input-field col s6">
                <input {...email} id="email_input" type="text" className="" />
                <label htmlFor="email_input">Почта</label>
            </div>
            <div className="input-field col s6">
                <input {...login} id="login_input" type="text" className="" />
                <label htmlFor="login_input">Имя</label>
            </div>
            <div className="input-field col s6">
                <input {...pass1} id="pass_input" type="password" className="" />
                <label htmlFor="pass_input">Пароль</label>
            </div>
            <div className="input-field col s6">
                <input {...pass2} id="pass_input_2" type="password" className="" />
                <label htmlFor="pass_input_2">Повторите пароль</label>
            </div>
            <div className={styles.btnWrapper}>
                <Button onClick={send}>Регистрация</Button>
                <Button
                    onClick={() => history.push('/')}
                > На главную
                </Button>
            </div>
        </div>
    </div >
}

export default Registration;