import React, { ReactElement, useState, useCallback, useEffect } from "react";
import axios from 'axios';
import { HTTP_EVENTS } from "../const/https/HTTP_EVENTS";
import { BACKEND_URL } from "../config/default";
import path from 'path';

interface IState {
    loggedIn: boolean,
    token: string,
    username: string;
}

interface IProps {
    state: IState,
    children: ReactElement | ReactElement[]
}

interface ContextValue {
    state: IState,
    actions: {
        [key: string]: (...args: any[]) => unknown
    }
}

// const instance = axios.create({
//     baseURL: BACKEND_URL,
//     timeout: 5000,
//     headers: {'X-Custom-Header': 'foobar'}
//   });

  axios.defaults.baseURL = BACKEND_URL

const AuthContext = React.createContext({} as ContextValue);

const AuthContextProvider = (props: IProps) => {
    const { children, state: defaultState } = props;
    const [state, setState] = useState<IState>(defaultState);
    
    const login = async (email: string, password: string) => {
        try {
            console.log('login', email, password);
            const res = await axios.post(HTTP_EVENTS.login, {
                email,
                password
            })
            if (!res.data.success) {
                alert(res.data.message)
            }
            console.log('res from login', res)
            if (res.data.success) {
               const token: string = res.data.token;
               localStorage.setItem('token', token)
               axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                setState(p => ({
                    ...p,
                    loggedIn: true,
                    token,
                    username: res.data.username
                }))
            }
        } catch (error) {
            console.log('error login', error)
        }

    }

    const logout = () => {
        localStorage.setItem('token', '');
        setState(p => ({
            ...p,
            loggedIn: false,
            token: '',
            username: ''
        }))
    }

    const register = async (login: string, email: string, password: string) => {
        try {
            console.log('register', login, email, password)
            const res = await axios.post(HTTP_EVENTS.registration, {
                email,
                password,
                username:login,
            })
            if (!res.data.success) {
                alert(res.data.message)
            }
            console.log('res from register', res)
        } catch (error) {
            console.log('error register', error)
        }
    }

    const checkAuth = async () => {
        console.log('Check auth')
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const res = await axios.post(HTTP_EVENTS.validate)
                if (!res.data.success) {
                    return alert(res.data.message)
                }

                setState(p => ({
                    ...p,
                    loggedIn: true,
                    token,
                    username: res.data.username
                }))
                console.log('res from checkAuth', res)
            }

        } catch (error) {
            console.log('error register', error)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const actions = {
        login,
        register,
        checkAuth,
        logout
    }

    return <AuthContext.Provider
        value={{
            state,
            actions
        }}
    >
        {children}
    </AuthContext.Provider>
}

AuthContextProvider.defaultProps = {
    state: {
        loggedIn: false,
        token: ''
    }
}

export { AuthContext, AuthContextProvider };