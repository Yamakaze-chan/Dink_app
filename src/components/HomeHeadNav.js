import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../globals/style';
import { firebase } from '../../Firebase/firebaseConfig';


const HomeHeadNav = ({ navigation }) => {
    const [userloggeduid, setUserloggeduid] = useState(null);
    const [userdata, setUserdata] = useState(null);
    useEffect(() => {
        const checklogin = () => {
            firebase.auth().onAuthStateChanged((user) => {
                // console.log(user);
                if (user) {
                    // navigation.navigate('home');
                    setUserloggeduid(user.uid);
                        //console.log(doc.id, " => ", doc.data());
                    
                } else {
                    // No user is signed in.
                    console.log('no user');
                }
            });
        }
        checklogin();
    }, [])
    const getuserdata = async () => {
        const docRef = firebase.firestore().collection('UserData').where('uid', '==', userloggeduid)
        const doc = await docRef.get();
        //console.log(doc);
        if (!doc.empty) {
            doc.forEach((doc) => {
                setUserdata(doc.data());
                console.log(doc.data())
            })
        }
        else {
            console.log('no user data');
        }
    }
    useEffect(() => {

        getuserdata();
    }, [userloggeduid]);
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
            {userdata && userdata.userImgUrl!="" ?
                <TouchableOpacity onPress={() => {navigation.navigate('userprofile')}}>
                <Image
                    source={{uri: userdata.userImgUrl}}
                    style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 26,
                        width: 26,
                        borderRadius: 180,
                        }}
                    />
                </TouchableOpacity>
                    :
                <TouchableOpacity onPress={() => { navigation.navigate('userprofile') }}>
                    <FontAwesome5 name="user-circle" size={26} color="black" style={{color: colors.cafe_title}} />
                </TouchableOpacity>}
            
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