import React, { useCallback, useEffect, useState } from "react";
import {ActivityIndicator, Alert, Text} from "react-native"

import { useFocusEffect } from "@react-navigation/core";
import {useTheme} from 'styled-components'
import { useAuth } from '../../hooks/auth'

import  AsyncStorage  from "@react-native-async-storage/async-storage";

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
    LoadingContainer
} from "./styles";

import { HighLighCard,  } from "../../components/HighlightCard";
import { TransactionCard, TransactionDataProps } from "../../components/TransactionCard";


export interface DataListProps extends TransactionDataProps{
    id: string;
}

interface highlightProps {
    amount: string,
    lastTransaction: string;
}

interface highLightData {
    incomes: highlightProps;
    outcomes: highlightProps;
    total: highlightProps;
}

export function Dashboard(){
    const[isLoading, setIsLoading] = useState<boolean>(true)
    const[transactionsData, setTransactionsData] = useState<DataListProps[]>();
    const[highlightData, sethighlightData] = useState<highLightData>({} as highLightData);
    const[hasTransactions, setHasTransactions] = useState({})

    const theme = useTheme();

    const { signOut, user } = useAuth();
    
    async function handleSignOut(){
        try {
            await signOut();
        } catch (error) {
            console.log(error);
            Alert.alert('nao foi possivel fazer o LogOut')
        }
    }

    function getLastTransaction( collection : DataListProps[], type: "up" | "down" ) {
        
        /*vou comentar aqui como era a funcao  lastTransactions só com o filtro sem o math (o math vai decidir quem é o maior numero dos 2)
        ----------------------------------------------
        const lastTransactionEntries = transactions
        .filter((item :  DataListProps) => item.type === 'up') // filtra somente as ENTRADAS DE DINHEIRO
        .map((item :  DataListProps) => new Date (item.date).getTime()) // Aplica um filtro pra trazer apenas as datas de quando foi a ENTRADA DE DINHEIRO
        
        ----------------------------------------------*/
        

        //Percorre a collection(as info armazenadas) e faz o filtro pra trazer a última transação dependendo do type(de entrada(up) ou de saída(down))
        const lastTransaction = 
            new Date(
            Math.max.apply(Math, collection //a funcao Math.max.apply recebe 2 parametros o Math que vai calcular o maior, e o segundo parametro que vai ser a coleção de onde ele vai tirar o maior
            .filter((item :  DataListProps) => item.type === type) // filtra somente um tipo ou ENTRADAS ou SAÍDAS
            .map((item :  DataListProps) => new Date (item.date).getTime()) // Aplica um filtro pra trazer apenas as datas de quando foi a ENTRADA DE DINHEIRO (e o New date com o .getTime() no final faz a data virar um numero para o math comparar e deopis volta pra data la em cima quando ele pega a saída e aplica um New Date)
        
        ));

        return `Última transação dia ${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: "long"})}`

    }

    async function loadTransactions(){ 
        const dataKey = `@gofinances:transactions_user:${user.id}`;//"Transaction é a mesma coisa de nome da tabela"
        const response = await AsyncStorage.getItem(dataKey); //Recebe o dataKey como string da tabela transactions
        
        let varentriesTotal = 0 // variável que armazena o total das transaçoes de entrada
        let varexpensiveTotal = 0 // variável que armazena o total das transaçoes de saída
        let varTotal = 0 // variável que armazena a diferença entre a entrada e a saída

        if (response != null){
           var transactions = JSON.parse(response) //transforma o response em objeto json e armazena no transactions
        }
        else {
            transactions = {}
        }
        
        const transactionFormatted : DataListProps[] = transactions
        .map((item : DataListProps) => {
            
            if (item.type === 'up'){
               varentriesTotal += Number(item.amount)
            } else {
                varexpensiveTotal += Number(item.amount)
            }


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


        //########## AQUI ABAIXO OS DADOS QUE SERÃO PROCESSADOS VÃO PREENCHER OS CARDS DO CARROSSEL OS HIGHLIGHTS
        //vai buscar a ultima transação de entrada
        const lastTransactionEntries = getLastTransaction(transactions, 'up')
        //vai buscar a ultima transação de saída
        const lastTransactionExpensives = getLastTransaction(transactions, 'down')

        varTotal = varentriesTotal - varexpensiveTotal;

        //Salva no useState "highlightData" a soma das entradas, saídas e o total q esta armazenado respectivamente em varentriesTotal, varexpensiveTotal, varTotal
        sethighlightData({
            incomes: {
                amount: varentriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries
            }, 

            outcomes: {
                amount: varexpensiveTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpensives
            },
            total: {
                amount: varTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: ""
            }
        });

        //Salva no useState "transactionsData" o objeto que esta armazenado em transactions
        setTransactionsData(transactionFormatted);    
        
         // Após a RECUPERAÇÃO DO BANCO (no nosso caso o ASYNCSTORAGE) ele seta o false pra poder a tela de loading sumir e mostrar o app
         setIsLoading(false);

        //Caso precise APAGAR TUDO DO BANCO(ASYNCSTORAGE) É SÓ CHAMAR remove() no final desse async (do lado de fora do {})
        async function remove(){
            await AsyncStorage.removeItem(`@gofinances:transactions_user:${user.id}`);
       } 
    }

    //o que está dentro desse hook é carregado simultaneamente junto com o app (na hora que ele inicia)
    // useEffect(() => {
    //     loadTransactions();
    // }, []) 
    
    //esse hook aqui a baixo permite recarregar somente um trecho da tela que no nosso caso é somente o flatlist. O flatlist ta sendo recarregado na hora que inserimos uma nova "linha" de entrada ou de saída
    useFocusEffect(
        useCallback(() => {
            loadTransactions();
            // async function removeTransactions(){
            //     await AsyncStorage.removeItem(`@gofinances:transactions_user:${user.id}`);
            //     console.log("removido");
            // }

            // removeTransactions();
        },[])
    );

    return (
        <Container> 
            { 
                isLoading ? 
                    <LoadingContainer>
                        <ActivityIndicator 
                            color= {theme.colors.primary} 
                            size="large"
                        />
                    </LoadingContainer>  :
                <>
                    <Header>
                    <UserWrapper>
                        <UserInfo>
                            <Photo source={{ uri: user.photo }}/>
                            <User>
                                <UserGreeting>Olá</UserGreeting>
                                <UserName>{user.name}</UserName>
                            </User>
                        </UserInfo>
                        <LogoutButton onPress={handleSignOut}>
                            <Icon name="power"/>
                        </LogoutButton>
                    </UserWrapper>
                    
                    </Header>
                    <HighlightCards>
                        <HighLighCard 
                        type="up"
                        title="Entradas" 
                        amount={highlightData.incomes.amount}
                        lastTransaction={highlightData.incomes.lastTransaction}
                        
                        />
                        <HighLighCard 
                        type="down"
                        title="Saídas" 
                        amount={highlightData.outcomes.amount} 
                        lastTransaction={highlightData.outcomes.lastTransaction}
                        
                        /><HighLighCard 
                        type="total"
                        title="Total" 
                        amount={highlightData.total.amount} 
                        lastTransaction={highlightData.total.lastTransaction}
                        
                        />
                    </HighlightCards>
                    
                    <Transactions>
                        <Title>Listagem</Title>
                        
                       <TransactionsList
                                data={transactionsData}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => (<TransactionCard data = {item}/>)}
                        />

                    </Transactions>
                </>           
            }
        </Container>
    )
}