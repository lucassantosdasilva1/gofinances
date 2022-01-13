import React, { createContext, ReactNode, useContext } from "react";

import * as AuthSession from 'expo-auth-session';

import * as Google from 'expo-google-app-auth';

interface AuthProviderProps {
    children: ReactNode; //tipo de elemento filho
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider( {children} : AuthProviderProps) {
    const user = {
        id: '0192830912',
        name: 'Lucas santos',
        email: 'lucas@email.com'
    };


    async function signInWithGoogle() {

        try {
            
            const response = await Google.logInAsync({
                androidClientId: '832691646712-idn381ig5rcv941o4ngv0ir2b1nsakin.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            })
            console.log(response);


        //     const CLIENT_ID = '832691646712-idn381ig5rcv941o4ngv0ir2b1nsakin.apps.googleusercontent.com';
        //     const REDIRECT_URI = 'https://auth.expo.io/@lucassantosdasilva1/gofinances';
        //     const RESPONSE_TYPE = 'token';
        //     const SCOPE = encodeURI('profile email')

        //     const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
            
        //     const response = await AuthSession.startAsync({ authUrl })
        //     console.log(response);

        } catch (error) {
            throw new Error();
        }
    }



    return (
        <AuthContext.Provider value={{ 
            user, 
            signInWithGoogle
        }}>
            {children}
        </AuthContext.Provider>

    )
}

function useAuth(){
    const context = useContext(AuthContext)
    return context;
}

export {AuthProvider, useAuth}