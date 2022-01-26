import React, {useEffect, useState} from "react";
import { 
    Modal,
    TouchableWithoutFeedback, 
    Keyboard,
    Alert,
} from "react-native";

import uuid from 'react-native-uuid'

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
 
import { useNavigation } from '@react-navigation/native'
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/auth";

import { Button } from "../../components/Forms/Button";

import  AsyncStorage  from "@react-native-async-storage/async-storage";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";

import { Container, Fields, Form, Header, Title, TransactionsTypes } from "./styles";
import { CategorySelect } from "../CategorySelect";

import { CategorySelectButton } from "../../components/Forms/CategorySelectButton/index";
import { InputForm } from "../../components/Forms/inputForm";


interface formData {
    name: string;
    amount: string;
}


const schema = Yup.object().shape({
    name: Yup
        .string().required('Nome é Obrigatório'),
    amount: Yup
        .number()
        .typeError('informe um valor numerico')
        .positive('O valor nao poder ser negativo')
        .required('O valor é obrigatório')

})

export function Register(){
    
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(Boolean);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {user} = useAuth();

    const navigation = useNavigation();

    const {
        control, //registrar os inputs
        handleSubmit, //pega todos os inputs e envia de uma lapada só 
        reset,
        formState: { errors } //captura os erros que vem do yup
    } = useForm({resolver: yupResolver(schema)}); //o que esse yupresolver vai fazer? Ele vai forçar q o submit siga um padrao para forçar temos que criar um schema

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true); //abrir
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false); //fechar
    }

    function handleTransactionsTypesSelect(type: 'up'|'down'){
        setTransactionType(type);
    }

    async function handleRegister(form: formData){
        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação');
        }
        
        if(category.key === 'category') {
            return Alert.alert('Selecione a categoria');
        }

        //Modelo do dado que vai ser salvo no asyncstorage
        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        //armazenando localmente com asyncstorage
        try {
            let dataKey = `@gofinances:transactions_user:${user.id}` //"nome da tabela"

            const dataRecovered = await AsyncStorage.getItem(dataKey);
            const currentData = dataRecovered ? JSON.parse(dataRecovered) : []; // O parse tranforma de string pra json

            
            const dataFormatted = [
                ...currentData,
                newTransaction
            ];

 
            
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));// O string transforma de jason pra string
            Alert.alert("salvo com sucesso");
            
            /// Neste bloco aqui a baixo utiliza o reset() para limpar os dados do formulário e 
            // setCategory para setar a categoria como categoria e
            // setTransactionType que seria down ou up para ' ' em branco
            reset();
            setCategory ({
                key: 'category',
                name: 'Categoria'
            })

            setTransactionType('');
            
            //-----

            //Aqui a baixo o useNavigation vai ser usado para redirecionar o usuario da tela de 
            // para a tela de listagem
            
            navigation.navigate("Listagem");

        } catch (error) {
            console.log(error);
            Alert.alert("Nao foi possível salvar");
        }



        
    }

   

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        /> 

                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric" //teclado numerico
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionsTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionsTypesSelect('up')}
                                isActive={transactionType ==='up'}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionsTypesSelect('down')}
                                isActive={transactionType ==='down'}
                            />
                        </TransactionsTypes>

                        <CategorySelectButton 
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />

                    </Fields>

                    <Button 
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category= {category}
                        setCategory= {setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>

            </Container>
        </TouchableWithoutFeedback>
    )
}