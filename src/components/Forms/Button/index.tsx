import React from "react";
import { TouchableOpacityProps } from "react-native";

import { Container, Title } from "./styles";

interface props extends TouchableOpacityProps{
    title: string;
}

export function Button({title, ...rest}: props){
    return (
        <Container {...rest}>
            <Title>
                {title}
            </Title>
        </Container>
    )
}