import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../globals/style';


const HomeHeadNav = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/** */}
            <Fontisto name="nav-icon-list-a" size={20} color="black" style={styles.myicon} />
            <View style={styles.containerin}>
                
                <Text style={styles.mytext}>UIT Drink</Text>
                <Image style= {{width: 24,height: 24, color: colors.cafe_title}} source={require("../../assets/vecteezy_coffee_1209429.png")}/>
                {/*
                <MaterialCommunityIcons name="food-outline" size={26} color="black" style={styles.myicon} />
                */}
            </View>
            <TouchableOpacity onPress={() => { navigation.navigate('userprofile') }}>
                <FontAwesome5 name="user-circle" size={26} color="black" style={{color: colors.cafe_title}} />
            </TouchableOpacity>
        </View>
    )
}

export default HomeHeadNav

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
        backgroundColor: colors.col1,
        elevation: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    containerin: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    myicon: {
        //color: colors.text1,
        color: '#FFFFFF'
    },
    mytext: {
        color: colors.cafe_title,
        fontSize: 24,
    },
})