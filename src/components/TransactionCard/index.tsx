import React from "react";
import {categories} from "../../categories";

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

// interface Category{
//     name: string;
//     icon: string;
// }

export interface TransactionDataProps {
    type: "up" | "down";
    name: string;
    amount: string;
    category: string;
    date: string;
}


interface props {
    data: TransactionDataProps;
}

export function TransactionCard( { data } : props){
    const category = categories.filter(
        item => item.key === data.category
    )[0];
    console.log("Data chegando no card",data)

    return(
        <Container>
            <Title>
                {data.name}
            </Title>

            <Amount type={data.type}>
                { data.type === 'down' && '-'}
                {data.amount} 
            </Amount>
            <Footer>
                <Category >
                    <Icon name={category.icon}/>
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <DateTransaction>{data.date}</DateTransaction>
            </Footer>
        </Container>
    )
}
