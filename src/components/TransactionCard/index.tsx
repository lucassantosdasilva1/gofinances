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
    name: string;//Salário Mensal
    icon: string;
}

interface data {
    title: string;
    amount: string;
    category: Category;
    date: string;
}


interface props {
    data: data
}

export function TransactionCard( { data } : props)
{
    return(
        <Container>
            <Title>{data.title}</Title>
            <Amount>{data.amount}</Amount>
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
