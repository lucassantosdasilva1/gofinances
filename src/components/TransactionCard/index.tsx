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
    type: 'up' | 'down'
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
                -1200
            </Amount>
            <Footer>
                <Category>
                    <Icon name='dollar-sign'/>
                    <CategoryName>Compras</CategoryName>
                </Category>
                <DateTransaction>12-12-21</DateTransaction>
            </Footer>
        </Container>
    )
}
