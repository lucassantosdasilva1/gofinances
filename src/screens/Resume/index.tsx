
import React, {useEffect, useState}from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {VictoryPie} from "victory-native"

import { HistoryCard } from "../../components/HistoryCard";

import { Container, Header, Title, Content } from "./styles";
import { DataListProps } from "../Dashboard";
import { categories } from "../../categories";

interface TransactionData extends DataListProps{

}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
}

export function Resume(){
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

    async function loadData(){
        let dataKey = '@gofinances:transactions' //"nome da tabela"

        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : []; // O parse tranforma de string pra json
        
        const expensives = responseFormatted.filter((expensive :  TransactionData) => expensive.type === 'down');

        const totalByCategory : CategoryData[] = []

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

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormatted: totalString,
                    color: category.color,
            })}
            
            
        })
        
        setTotalByCategories(totalByCategory);
    }

    useEffect(()=>{
        loadData()
    },[])

    return (
        <Container>
        <Header>
            <Title>Resumo Por Categoria</Title>
        </Header>
        <Content contentContainerStyle= {{ flex: 1, padding: 24 }}>
            <VictoryPie
                data={totalByCategories}
                x="name"
                y="total"
            />

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
        </Container>
    )

}

