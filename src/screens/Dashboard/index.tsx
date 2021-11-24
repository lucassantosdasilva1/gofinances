import React from "react";
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
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
} from "./styles";

import { HighLighCard,  } from "../../components/HighlightCard";
import { TransactionCard, TransactionDataProps } from "../../components/TransactionCard";
import { getBottomSpace } from "react-native-iphone-x-helper";

export interface DataListProps extends TransactionDataProps{
    id: string;
}

export function Dashboard(){

    
    const data : DataListProps[] = [
    {
        id: '1',
        type: 'positive',
        title: "Desenvolvimento de Site",
        amount: "R$ 12.000,00",
        category: {
            name: 'Vendas',
            icon: 'dollar-sign'
        },
        date: "13/04/2020"
    },
    {
        id: '2',
        type: 'negative',
        title: "Hamburgueria Pizzy",
        amount: "R$ 59,00",
        category: {
            name: 'Alimentação',
            icon: 'coffee'
        },
        date: "13/04/2020"
    },
    {
        id: '3',
        type: 'negative',
        title: "Aluguel do apartamento",
        amount: "R$ 1.200,00",
        category: {
            name: 'casa',
            icon: 'home'
        },
        date: "13/04/2020"
    }]

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
                <Icon name="power"/>
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
                    keyExtractor={item => (item.id)}
                    renderItem={({item}) => (<TransactionCard data = {item}/>)}
                />
    
            </Transactions>
           
        </Container>
    )
}