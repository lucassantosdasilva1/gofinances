import styled from "styled-components/native";
import { Feather } from '@expo/vector-icons'
import { RFValue } from "react-native-responsive-fontsize";

import { TransactionDataProps } from "../../components/TransactionCard";

interface TransactionProps extends TransactionDataProps{
    type: "up" | "down"
}

export const Container = styled.View`
    background-color: ${({theme}) => theme.colors.shape};
    border-radius: 5px;

    padding: 17px 24px;

    margin-top: ${RFValue(16)}px;
`;

export const Title = styled.Text`
    font-size: ${RFValue(14)}px;
`;

export const Amount = styled.Text<TransactionProps>`

    font-size: ${RFValue(24)}px;
    font-family: ${({theme}) => theme.fonts.regular};
    color: ${({theme, type}) => type === "up" ? theme.colors.success : theme.colors.attention};

    margin-top: 2px;
`;

export const Footer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 19px;
`;
export const Category = styled.View`
    flex-direction: row;
    align-items: center;
`;
export const Icon = styled(Feather)`
    font-family: ${({theme}) => theme.fonts.regular};
    color: ${({theme}) => theme.colors.text};
    font-size: ${RFValue(20)}px;
    margin-right: ${RFValue(17)}px;
`;

export const CategoryName = styled.Text`
    font-family: ${({theme}) => theme.fonts.regular};
    color: ${({theme}) => theme.colors.text};
    font-size: ${RFValue(14)}px;

`;
export const DateTransaction = styled.Text`
    font-family: ${({theme}) => theme.fonts.regular};
    color: ${({theme}) => theme.colors.text};
    font-size: ${RFValue(14)}px;
`;