import React from "react";
import {
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    DateTransaction,
} from "./styles";

interface Category{
    name: string;
    icon: string;
}

export interface TransactionDataProps {
    type: "up" | "down";
    name: string;
    amount: string;
    category: Category;
    date: string;
}


interface props {
    data: TransactionDataProps;
}

export function TransactionCard( { data } : props)
{
    return(
        <Container>
            <Title>nome</Title>
            <Amount type={data.type}>
                {data.amount} 
            </Amount>
            <Footer>
                <Category >
                    <Icon name='dollar-sign'/>
                    <CategoryName>{data.category}</CategoryName>
                </Category>
                <DateTransaction>{data.date}</DateTransaction>
            </Footer>
        </Container>
    )
}
