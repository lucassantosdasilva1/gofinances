import React from "react";
import { FlatList} from "react-native-gesture-handler";
import { categories } from "../../categories";
import { Button } from "../../components/Forms/Button";
import { 
    Container, 
    Header, 
    Title, 
    Category, 
    Icon, 
    Name, 
    Separator, 
    Footer
} from "./styles";
import {Text, StyleSheet} from "react-native"

interface Category {
    key: string;
    name: string;
}

interface Props {
    category: Category;
    setCategory: (category: Category) => void;
    closeSelectCategory: () => void;
}


export function CategorySelect(
    {category,
    setCategory,
    closeSelectCategory
} : Props){

    function handlerCategorySelect(category: Category) {
        setCategory(category)
    }

    return(
        <Container>
            <Header>
                <Title>Categorya</Title>
            </Header>

            <FlatList
                data={categories}
                style={{flex: 1, width: '100%'}}
                keyExtractor={(item) => item.key}
                renderItem={({item}) => (
                    <Category
                        onPress={() => handlerCategorySelect(item)}
                        isActive={category.key === item.key}
                    >
                        <Icon name={item.icon} />
                        <Name>{item.name}</Name>
                    </Category>
                )} 
                ItemSeparatorComponent={() => <Separator/>}  
            />

            <Footer>
                <Button 
                    title="Selecionar" 
                    onPress={closeSelectCategory}
                />

            </Footer>

        </Container>
    )
}