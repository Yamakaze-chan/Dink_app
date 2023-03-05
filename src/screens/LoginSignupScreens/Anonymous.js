import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { titles, colors, btn1, hr80 } from "../../globals/style";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import { firebase } from "../../../Firebase/firebaseConfig";

const Anonymous = ({ navigation }) => {
    const [address, setAddress] = useState(null)
    const [name, setName] = useState(null)
    const [uid, setUID] = useState(null)
    const [phone, setPhone] = useState(null)

    const [customError, setCustomError] = useState("");

    const logginasguest = () => {
        try
        {
            firebase.auth().signInAnonymously().then(()=>{
                firebase.auth().onAuthStateChanged((user) => {
                if(phone != null && name !=null && address != null)
                {
                    const userRef = firebase.firestore().collection("UserData");
                    console.log(user.uid)
                    userRef.add({
                        email: null,
                        password: null,
                        // cpassword: cpassword,
                        phone: phone,
                        name: name,
                        address: address,
                        uid: user?.uid,
                        userImgUrl: "",
                    })
                    navigation.navigate('home')
                }
                else
                {
                    setCustomError("Please fill all information")
                }
                //console.log(user)
                
                })
            })
        }
        catch(e)
        {
            console.log(e)
        }
        /** 
        firebase.auth().signInWithEmailAndPassword('guest@gmail.com','guest123').then((userCredential) => {
            firebase.auth().onAuthStateChanged((user) => {
                // console.log(user);
                if (user) {
                    // navigation.navigate('home');
                    console.log(user);
                    setUserlogged(user);
                } else {
                    // No user is signed in.
                    console.log('no user1');
                }
            });
    })
    */
    }

    return(
        <View style={styles.container}>
            <Text style={styles.head1}>Guest Information</Text>
            {customError !== "" && (
              <Text style={styles.errormsg}>{customError}</Text>
            )}
            <View style={styles.inputout}>
                <AntDesign name="user" size={24} />
                <TextInput style={styles.input} placeholder="Name" onFocus={() => {

                }}
                onChangeText={(text) => setName(text)}
                />
            </View>
            <View style={styles.inputout}>
                <MaterialCommunityIcons name="cellphone" size={24}  />
                <TextInput style={styles.input} placeholder="Phone" onFocus={() => {

                }}
                onChangeText={(text) => setPhone(text)}
                />
            </View>
            <View style={styles.inputout}>
                <MaterialCommunityIcons name="table-chair" size={24}  />
                <TextInput style={styles.input} placeholder="Table" onFocus={() => {

                }}
                onChangeText={(text) => setAddress(text)}
                />
            </View>
            <TouchableOpacity style={btn1} onPress={logginasguest}>
                <Text style={{ color: colors.col1, fontSize: titles.btntxt, fontWeight: "bold" }}>Confirm</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    head1: {
        //fontSize: titles.title1,
        fontSize: 60,
        //color: colors.text1,
        color: colors.cafe_title,
        textAlign: 'center',
        marginVertical: 10,
    },
    inputout: {
        flexDirection: 'row',
        width: '80%',
        marginVertical: 10,
        backgroundColor: colors.col1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        // alignSelf: 'center',
        elevation: 20,
    },
    input: {
        fontSize: 18,
        marginLeft: 10,
        width: '80%',
    },
    forgot: {
        color: colors.text2,
        marginTop: 20,
        marginBottom: 10,
    },
    or: {
        color: colors.text1,
        marginVertical: 10,
        fontWeight: 'bold',
    },
    gftxt: {
        color: colors.text2,
        marginVertical: 10,
        fontSize: 25,
    },
    gf: {
        flexDirection: 'row'
    },
    gficon: {
        backgroundColor: 'white',
        width: 50,
        margin: 10,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        elevation: 20,
    },
    signup: {
        color: colors.text1,
    },
    errormsg: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
})

export default Anonymous;

