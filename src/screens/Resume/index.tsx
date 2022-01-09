
import React, {useEffect, useState, useCallback}from "react";
import { ActivityIndicator } from 'react-native'
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage";



import {VictoryPie} from "victory-native"

import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'




import { HistoryCard } from "../../components/HistoryCard";

import { 
    Container, 
    Header, 
    Title, 
    Content, 
    ContainerScroll, 
    ChartContainer,
    MonthSelect,
    MonthSelectIcon,
    MonthSelectButton,
    Month,
    LoadingContainer
} from "./styles";
import { DataListProps } from "../Dashboard";
import { categories } from "../../categories";
import { ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import theme from "../../global/styles/theme";


interface TransactionData extends DataListProps{

}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume(){
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    function handleDateChange(action: 'next' | 'prev' ){
        //quando o usuario clicar para avancar ou retroceder o mes vai aparecer o simbolo de carregando
        setIsLoading(true);

        if(action === "next") {
            setSelectedDate(addMonths(selectedDate, 1))
        }else{
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }

    async function loadData(){
        let dataKey = '@gofinances:transactions' //"nome da tabela"

        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : []; // O parse tranforma de string pra json
        
        //Essa variavel armazena todos os gastos(down). Além disso filtra tbm por mes e ano
        const expensives = responseFormatted.filter((expensive :  TransactionData) => 
            expensive.type === 'down' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
        );

        //Essa variável vai armazenar o total geral de gastos, todo o somatório
        const expensivesTotal = expensives
        .reduce((acumullator: number, expensive: TransactionData) => {
            return acumullator + Number(expensive.amount);
        }, 0)

        // console.log("total",expensivesTotal)

        //Esse array vai armazenar o total por categoria
        const totalByCategory : CategoryData[] = []

        //Essa operação a baixo vai extrair o total por categoria e adicionar(push) ao totalByCategory
        categories.forEach(category => {
            let categorySum = 0

            expensives.forEach((expensive : DataListProps) => {
                if(expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            });

            

            if(categorySum > 0){
                const totalString = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormatted: totalString,
                    color: category.color,
                    percent: percent
            })}
            
            
        })
        
        setTotalByCategories(totalByCategory);
        setIsLoading(false);
    }

    useEffect(()=>{
        loadData()
    },[selectedDate]) /*o SelectedDate esta aqui dentro dos colchetes pq isso vira parametro 
    para autalizar o effect, toda vez que o valor do selectedDate alterar o useEffect vai atualizar a pagina de resume fazendo com o que o grafico atualize para o mes do contexto*/

    //UseFocusEffect é usado aqui para quando nós adicionarmos novas entradas ou saídas o gráfico se atualize automaticamente (exemplo: adiciono uma saída de cinema e o grafico vai automaticamente atualizar tbm)
    useFocusEffect(
        useCallback(() => {
            loadData();
        },[])
    );


    return (
        <Container>
            <Header>
                <Title>Resumo Por Categoria</Title>
            </Header>
        {
            isLoading ? 
                <LoadingContainer>
                    {/* ActivityIndicator é o simbolo de carregando */}
                    <ActivityIndicator 
                        color= {theme.colors.primary} 
                        size="large"
                    />
                </LoadingContainer>  :
            <>
                
                <ContainerScroll>
                    <Content 
                        showsVerticalScrollIndicator={false}
                    >
                        
                        <MonthSelect >
                            <MonthSelectButton onPress={() => handleDateChange('prev')} >
                                <MonthSelectIcon name="chevron-left"/>
                            </MonthSelectButton>
                        

                            <Month>{ format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

                        
                            <MonthSelectButton onPress={() => handleDateChange('next')}>
                                <MonthSelectIcon name="chevron-right"/>
                            </MonthSelectButton>
                        </MonthSelect>

                        <ChartContainer>
                            <VictoryPie
                                    data={totalByCategories}
                                    x="percent"
                                    y="total"
                                    colorScale = {totalByCategories.map(category => category.color)}
                                    style={{
                                        labels: {
                                            fontSize: RFValue(18),
                                            fontWeight: 'bold',
                                            fill: theme.colors.shape
                                        }
                                    }}
                                    labelRadius={50}
                                    width = {350}
                                    height = {325}
                            />
                        </ChartContainer>
                        
                        {
                            totalByCategories.map( item => (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }

                        {
                            totalByCategories.map( item => (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }
                        {
                            totalByCategories.map( item => (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }
                        {
                            totalByCategories.map( item => (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }
                        {
                            totalByCategories.map( item => (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }

                        {
                            totalByCategories.map( item => (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }
                        
                    </Content>
                </ContainerScroll>
            </>
        }
        </Container>
    )

}

