import React, { useEffect, useState } from "react";
//import {Feather} from '@expo/vector-icons'
//import {Text} from "react-native"

import { 
    Container, 
    Header,
    Photo,
    UserInfo,
    User,
    UserName,
    UserGreeting,
    UserWrapper,
    LogoutButton,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
} from "./styles";

import { HighLighCard,  } from "../../components/HighlightCard";
import { TransactionCard, TransactionDataProps } from "../../components/TransactionCard";
import { getBottomSpace } from "react-native-iphone-x-helper";

import  AsyncStorage  from "@react-native-async-storage/async-storage";
import { Text } from "react-native";

export interface DataListProps extends TransactionDataProps{
    id: string;
}

export function Dashboard(){

    const[data, setData] = useState<DataListProps[]>();
    console.log("DATA NO INICIOZIN-------------------------------",data);

    

    async function loadTransactions(){ 
        const dataKey = '@gofinances:transactions';//"Transaction é a mesma coisa de nome da tabela"
        const response = await AsyncStorage.getItem(dataKey); //Recebe o dataKey como string da tabela transactions
        
        if (response != null){
           var transactions = JSON.parse(response) //transforma o response em objeto json e armazena no transactions
        }
        else {
            var transactions = {}
        }

       
        const transactionFormatted : DataListProps[] = transactions
        .map((item : DataListProps) => {
            const amount = Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});

            const date =  Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: "2-digit",
                year: "2-digit",
            }).format(new Date(item.date))

            return {
                id: item.id,
                name: item.name,
                amount: amount,
                type: item.type,
                category: item.category,
                date: date
            }  
        });

            console.log("transactionsFormatted", transactionFormatted);
        


        setData(transactionFormatted);//Salva no useState "data" o objeto que esta armazenado em transactions

 
        console.log("transactions: ", transactions) //printa o que ta salvo em transactions

         async function remove(){
             await AsyncStorage.removeItem(dataKey)
        } 
        
    }
    
   

    useEffect(() => {
         
        loadTransactions();
        console.log("O data(recebendo transactions ) ta vindo assim: ", data)

    }, []) //hook que carrega o que ta dentro da função ao mesmo tempo que a interface é carregada

    return (
        <Container> 
            <Header>
            <UserWrapper>
                <UserInfo>
                    <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/42879994?v=4' }}/>
                    <User>
                        <UserGreeting>Olá</UserGreeting>
                        <UserName>Lucas</UserName>
                    </User>
                </UserInfo>
                <LogoutButton onPress={()=>{}}>
                    <Icon name="power"/>
                </LogoutButton>
            </UserWrapper>
            
            </Header>
            <HighlightCards>
                <HighLighCard 
                type="up"
                title="Entradas" 
                amount="R$ 17.420" 
                lastTransaction="Ultima entrada dia 13 de abril"
                
                />
                <HighLighCard 
                type="down"
                title="Saídas" 
                amount="R$ 1.259" 
                lastTransaction="Ultima entrada dia 13 de abril"
                
                /><HighLighCard 
                type="total"
                title="Total" 
                amount="R$ 16.141" 
                lastTransaction="01 a 16 de abril"
                
                />
            </HighlightCards>
           
            <Transactions>
                <Title>Listagem</Title>
                <TransactionsList
                    data={data}
                    renderItem={(item) => (<TransactionCard data = {item}/>)}
                />
    
            </Transactions>
           
        </Container>
    )
}