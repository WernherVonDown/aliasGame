import React, { useContext, useEffect } from "react";
import { Button, TextInput } from "react-materialize";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import useInput from "../../hooks/useInput";
import MainHeader from "../MainHeader/MainHeader";
import styles from './Login.module.scss';

const Login = () => {
    const { actions: authActions, state: authState } = useContext(AuthContext);
    const history = useHistory();
    const email = useInput('');
    const pass = useInput('');
    useEffect(() => {
        if (authState.loggedIn) {
            history.push('/')
        }
    }, [authState.loggedIn])
    const send = () => {
        if (!pass.value.length || !email.value.length) {
            return alert('Заполните все поля');
        }

        authActions.login(email.value, pass.value)
    }
    // const []
    return <div className={styles.content}>
        <MainHeader />
        <div className={styles.formWrapper}>
            <div className={styles.titleText}>Войти</div>
            {/* <div>
                <TextInput validate placeholder="Почта" />
            </div> */}
            <div className="input-field col s6">
                <input {...email} id="email_input" type="text" className="" />
                <label htmlFor="email_input">Почта</label>
            </div>
            <div className="input-field col s6">
                <input {...pass} id="pass_input" type="password" className="" />
                <label htmlFor="pass_input">Пароль</label>
            </div>
            {/* <div>

                <TextInput password validate placeholder="Пароль" />
            </div> */}
            <div className={styles.btnWrapper}>
                <Button onClick={send}>Войти</Button>
                <Button
                    onClick={() => history.push('/')}
                > На главную
                </Button>
            </div>
        </div>
    </div >
}

export default Login;