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
    type: 'positive'| 'negative'
    title: string;
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
            <Title>{data.title}</Title>
            <Amount type={data.type}>
                {data.type === 'negative' && '- '}
                {data.amount}
            </Amount>
            <Footer>
                <Category>
                    <Icon name={data.category.icon}/>
                    <CategoryName>{data.category.name}</CategoryName>
                </Category>
                <DateTransaction>{data.date}</DateTransaction>
            </Footer>
        </Container>
    )
}
