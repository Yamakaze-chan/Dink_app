import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import logo from '../../../assets/coffee_logo.png';
import { colors, hr80 } from '../../globals/style';
import { firebase } from '../../../Firebase/firebaseConfig'
import { getAuth, signInAnonymously } from "firebase/auth";

const LogoutScreen = ({ navigation }) => {
    return (
        <View>
            <Text>Please wait</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#ff4242',
        backgroundColor: '#ffffff',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 50,
        color: colors.cafe_title,
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: '200',
    },
    logoout: {
        width: "80%",
        height: "30%",
        // backgroundColor: '#fff',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    text: {
        fontSize: 18,
        width: '80%',
        //color: colors.col1,
        color: colors.cafe_title,
        textAlign: 'center',
    },
    btnout: {
        flexDirection: 'row',
    },
    btn: {
        fontSize: 20,
        color: colors.col1,
        textAlign: 'center',
        marginVertical: 30,
        marginHorizontal: 10,
        fontWeight: '700',
        //backgroundColor: '#fff',
        backgroundColor: colors.cafe_title,
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
    },
    logged: {
        alignItems: 'center',

    },
    txtlog: {
        fontSize: 16,
        color: colors.cafe_title,
    },
    txtlogin: {
        fontSize: 16,
        color: colors.cafe_title,
        fontWeight: '700',
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline',
    }
})
export default LogoutScreen