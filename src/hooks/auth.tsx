import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

//consumindo os dados do .env
const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;


import * as AuthSession from 'expo-auth-session';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

interface DTOResponseUserInfo{
    email: string,
    family_name: string,
    given_name: string,
    id: string,
    locale: string,
    name: string,
    picture: string,
    verified_email: boolean,
} 

interface AuthProviderProps {
    children: ReactNode; //tipo de elemento filho
}

interface User {
    id: String;
    name: String;
    email: String;
    photo?: String;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider( {children} : AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User);
    const [userStorageLoading, setUserStorageLoading] = useState(true);
   
    const userStorageKey = '@gofinances:user';

    async function signInWithGoogle() {

        try {
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email')

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
            
            const { type, params} = await AuthSession
            .startAsync({ authUrl }) as AuthorizationResponse;
            
            let userLogged = {} as User;

            if (type === 'success'){
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${String(params.access_token)}`);
                const userInfo = await response.json();

                console.log("userINFO:     ", userInfo);

                userLogged = {
                    id: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    photo: userInfo.picture
                }
                setUser(userLogged);
                //salvando os dados do usuario no AsyncStorage
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            };

            

        } catch (error) {
            throw new Error();
        }
    }

    async function signInWithApple(){Alert.alert("Tem Que implementar ne meu preto? Primeiro que tu nao tem iphone")}

    async function signOut(){
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey)
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStoraged = await AsyncStorage.getItem(userStorageKey);
            
            if(userStoraged) {
                const userLogged = JSON.parse(userStoraged) as User;
                setUser(userLogged);
            }
            
            setUserStorageLoading(false);
        }

        loadUserStorageData();
    }, [])

    return (
        <AuthContext.Provider value={{ 
            user: user, 
            signInWithGoogle: signInWithGoogle,
            signInWithApple: signInWithApple,
            signOut: signOut,
            userStorageLoading: userStorageLoading
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