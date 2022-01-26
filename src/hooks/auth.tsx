import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

//consumindo os dados do .env
const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;


import * as AuthSession from 'expo-auth-session';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider( {children} : AuthProviderProps) {
    const [userr, setUser] = useState('');
    const [user2, setUser2] = useState<User>({} as User);
   
    
    const userStorageKey = '@gofinances:user';

    async function signInWithGoogle() {

        try {
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email')

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
            
            const { type, params} = await AuthSession
            .startAsync({ authUrl }) as AuthorizationResponse;
            
            

            if (type === 'success'){
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${String(params.access_token)}`);
                const userInfo = await response.json();
                console.log("userINFO:     ", userInfo);

                setUser("teste");
                console.log("userr", userr);

                const dataUser : User = {
                    id: userInfo.id,
                    name: userInfo.given_name,
                    email: userInfo.email,
                    photo: userInfo.picture
                }

                setUser2(dataUser);
                console.log("user2: ", user2)

            }
            
        } catch (error) {
            throw new Error();
        }
    }



    useEffect(() => {
        async function loadUserStorageData() {
            // await AsyncStorage.
        }
    }, [])

    return (
        <AuthContext.Provider value={{ 
            user: user2, 
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