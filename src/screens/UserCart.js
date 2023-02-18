import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { btn2, colors, hr80, navbtn, navbtnin } from '../globals/style'
import { AntDesign } from '@expo/vector-icons';
import { firebase } from '../../Firebase/firebaseConfig';
import BottomNav from '../components/BottomNav';

const UserCart = ({ navigation }) => {
    const [cartdata, setCartdata] = useState(null);
    const [totalCost, setTotalCost] = useState('0');

    const getcartdata = async () => {
        const docRef = firebase.firestore().collection('UserCart').doc(firebase.auth().currentUser.uid);

        docRef.get().then((doc) => {
            if (doc.exists) {
                const data = JSON.stringify(doc.data());
                setCartdata(data)
            } else {
                console.log('No such document!');
            }
        })
    }

    useEffect(() => {

        getcartdata();
    }, [])

    useEffect(() => {
        if (cartdata != null) {
            const foodprice = JSON.parse(cartdata).cart;
            let totalfoodprice = 0;
            foodprice.map((item) => {
                // console.log(item.data.foodPrice)
                totalfoodprice = (parseInt(item.data.foodPrice) * parseInt(item.Foodquantity)) + totalfoodprice;
            })
            // console.log(totalfoodprice)
            setTotalCost(JSON.stringify(totalfoodprice))
        }
    }, [cartdata])
    // console.log(cartdata)

    // console.log(JSON.parse(cartdata).cart[0].data);



    const deleteItem = (item) => {
        const docRef = firebase.firestore().collection('UserCart').doc(firebase.auth().currentUser.uid);
        docRef.update({
            cart: firebase.firestore.FieldValue.arrayRemove(item)
        })
        getcartdata();

    }

    const formatcurr = (n) => {
        return String(parseInt(n).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).slice(0, -2);
      }
    // console.log(typeof (cartdata))
     

    const placeorderofcart = () =>{
        if(cartdata == null || JSON.parse(cartdata).cart.length == 0)
        {
            Alert.alert('Empty cart', 'Your cart is empty at the momment', [
                {
                  text: 'OK',
                },
              ]);
        }
        else
        {
            Alert.alert('Order Success', 'Your order has been received', [
                {
                  text: 'OK',
                },
              ]);
        navigation.navigate('placeorder', { cartdata });
        }
        {/*
        JSON.parse(cartdata).cart.forEach(element => {
            deleteItem(element)
        });
        //setCartdata(null);
        //console.log(cartdata)
        */}
        
    }

    return (

        <View style={styles.containerout}>
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
                <View style={navbtn}>
                    <AntDesign name="back" size={24} color="black" style={navbtnin} />
                </View>
            </TouchableOpacity>
            <View style={styles.bottomnav}>
                <BottomNav navigation={navigation} />
            </View>
            <View style={styles.container}>
                <Text style={styles.head1}>Your Cart</Text>
                <View style={styles.cartout}>
                    {cartdata == null || JSON.parse(cartdata).cart.length == 0 ?
                        <Text style={styles.head2}>Your Cart is Empty</Text>
                        :
                        <View>
                        <ScrollView horizontal={true} style={{ width: "100%" }}>
                        <FlatList style={styles.cardlist} data={JSON.parse(cartdata).cart} renderItem={
                            ({ item }) => {
                                return (
                                    <View style={styles.cartcard}>
                                        <Image source={{ uri: item.data.foodImageUrl }} style={styles.cartimg} />
                                        <View style = {{flexDirection:'column'}}>
                                            <View style={styles.cartcardin}>
                                                <View style={styles.c1}>
                                                    <Text style={styles.txt1}>{item.Foodquantity}&nbsp;{item.data.foodName}</Text>
                                                    <Text style={styles.txt2}>{formatcurr(item.data.foodPrice)} đ/each</Text>
                                                </View>
                                                
                                            </View>
                                            <TouchableOpacity style={styles.c4} onPress={() => deleteItem(item)}>
                                                    <Text style={styles.txt1}>Delete</Text>
                                                    <AntDesign name="delete" size={24} color="black" style={styles.del} />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                )
                            }
                        } />
                        </ScrollView>
                        </View>}
                        
                </View>
                <View style={styles.btncont}>
                    <View style={styles.c3}>
                        <Text style={styles.txt5}>Total</Text>
                        <Text style={styles.txt6}>{formatcurr(totalCost)} đ</Text>
                    </View>
                    <TouchableOpacity style={btn2}>
                        <Text style={styles.btntxt} onPress={() => placeorderofcart()}>Place Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default UserCart

const styles = StyleSheet.create({
    containerout: {
        flex: 1,
        backgroundColor: colors.col1,
        // alignItems: 'center',
        width: '100%',
        // height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: colors.col1,
        // alignItems: 'center',
        // justifyContent: 'center',
        width: '100%',
        // height: '100%',
    },
    head1: {
        fontSize: 40,
        textAlign: 'center',
        // fontWeight: '200',
        // marginVertical: 20,
        color: colors.text1,
    },
    head2: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: '200',
        marginVertical: 20,
        elevation: 10,
        backgroundColor: colors.col1,
        width: '90%',
        height: '50%',
        alignSelf: 'center',
        paddingVertical: '25%',
        borderRadius: 10,
    },
    cartcard: {
        flexDirection: 'row',
        backgroundColor: colors.col1,
        marginVertical: 5,
        borderRadius: 10,
        width: '95%',
        height: 150,
        alignSelf: 'center',
        elevation: 10,
        alignItems: 'center',
    },
    cartimg: {
        width: 150,
        height: 150,
        borderRadius: 10,
        resizeMode: 'center',
    },
    cartcardin: {
        flexDirection: 'row',
        margin: 5,
        width: '58%',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: colors.text1,

    },
    cardlist: {
        width: '100%',
    },
    cartout: {
        flex: 1,
        width: '100%',
    },
    btntxt: {
        backgroundColor: colors.text1,
        color: colors.col1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 20,
        borderRadius: 10,
        width: '90%',
        textAlign: 'center',

    },
    btncont: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        flexDirection: 'column',
        marginBottom: 80,
        borderTopColor: colors.text3,
        borderTopWidth: 0.2,
    },
    bottomnav: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: colors.col1,
        zIndex: 20,
    },
    c1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: colors.col1,
        borderRadius: 10,
        padding: 5,
    },
    txt1: {
        fontSize: 16,
        color: colors.text1,
        width: '60%',
        fontWeight: 'bold',
    },
    txt2: {
        fontSize: 16,
        color: colors.text3,
        fontWeight: 'bold',
    },
    c2: {
        backgroundColor: colors.text1,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        flexDirection: 'row',
    },
    txt3: {
        fontSize: 15,
        color: colors.col1,
    },
    txt5: {
        fontSize: 20,
        color: colors.text3,
        marginHorizontal: 5,
    },
    txt6: {
        fontSize: 25,
        color: colors.text3,
        marginHorizontal: 5,
        fontWeight: 'bold',
    },
    c3: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    c4: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        borderRadius: 10,
        borderColor: colors.text1,
        borderWidth: 1,
        marginVertical: 10,
        padding: 5,
    },
    del: {
        color: colors.text1,
    }
})