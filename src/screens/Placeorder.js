import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { btn1, colors, hr80, navbtn, navbtnin } from '../globals/style';
import { firebase } from '../../Firebase/firebaseConfig';
import { AntDesign } from '@expo/vector-icons';

const Placeorder = ({ navigation, route }) => {
    const [orderdata, setOrderdata] = useState([]);
    const [totalCost, setTotalCost] = useState('0');
    const { cartdata } = route.params;
    useEffect(() => {
        setOrderdata(JSON.parse(cartdata));
    }, [cartdata])

    // console.log(orderdata.cart[0])
    // console.log(typeof (orderdata))

    // console.log(cartdata)



    // userdata -------------------------------------------------------
    const [userloggeduid, setUserloggeduid] = useState(null);
    const [userdata, setUserdata] = useState(null);
    useEffect(() => {
        const checklogin = () => {
            firebase.auth().onAuthStateChanged((user) => {
                // console.log(user);
                if (user) {
                    // navigation.navigate('home');
                    setUserloggeduid(user.uid);
                } else {
                    // No user is signed in.
                    console.log('no user');
                }
            });
        }
        checklogin();
    }, [])

    // // console.log(userloggeduid);

    useEffect(() => {
        const getuserdata = async () => {
            const docRef = firebase.firestore().collection('UserData').where('uid', '==', userloggeduid)
            const doc = await docRef.get();
            if (!doc.empty) {
                doc.forEach((doc) => {
                    setUserdata(doc.data());
                })
            }
            else {
                console.log('no user data');
            }
        }
        getuserdata();
    }, [userloggeduid]);

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

    // console.log(userdata);

    const deleteItem = (item) => {
        const docRef = firebase.firestore().collection('UserCart').doc(firebase.auth().currentUser.uid);
        docRef.update({
            cart: firebase.firestore.FieldValue.arrayRemove(item)
        })

    }

    

    const placenow = () => {
            const docRef = firebase.firestore().collection('UserOrders').doc(new Date().getTime().toString());
            docRef.set({
                orderid: docRef.id,
                orderdata: orderdata.cart,
                orderstatus: 'pending',
                ordercost: totalCost,
                orderdate: firebase.firestore.FieldValue.serverTimestamp(),
                orderaddress: userdata.address,
                orderphone: userdata.phone,
                ordername: userdata.name,
                orderuseruid: userloggeduid,
                orderpayment: 'online',
                paymenttotal: totalCost
            })
            
            Alert.alert('Đặt thành công','Vui lòng có mặt trong vòng 1 giờ');
            // navigation.navigate('trackorders');
            JSON.parse(cartdata).cart.forEach(element => {
                deleteItem(element)
            });
            navigation.navigate('home');
    }

    const formatcurr = (n) => {
        return String(parseInt(n).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).slice(0, -2);
      }

    return (
        <ScrollView style={styles.containerout}>
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
                <View style={navbtn}>
                    <AntDesign name="back" size={24} color="black" style={navbtnin} />
                </View>
            </TouchableOpacity>
            <View style={styles.container}>

                <Text style={styles.head1}>Xác nhận đơn hàng</Text>
                
                <ScrollView horizontal={true} style={{ width: "100%" }}>
                <FlatList style={styles.c1} data={orderdata.cart} renderItem={
                    ({ item }) => {
                        return (
                            <View style={styles.rowout}>
                                <View style={styles.row}>
                                    <View style={styles.left}>
                                        <Text style={styles.qty}>{item.Foodquantity}</Text>
                                        <Text style={styles.title}>{item.data.foodName}</Text>
                                        <Text style={styles.price1}>{formatcurr(item.data.foodPrice)} đ</Text>
                                    </View>
                                    <View style={styles.right}>
                                        <Text style={styles.totalprice}>{formatcurr(parseInt(item.Foodquantity) * parseInt(item.data.foodPrice))} đ</Text>
                                    </View>
                                </View>
                                {/** 
                                <View style={styles.row}>
                                    <View style={styles.left}>
                                        <Text style={styles.qty}>{item.Addonquantity}</Text>
                                        <Text style={styles.title}>{item.data.foodAddon}</Text>
                                        <Text style={styles.price1}>{item.data.foodAddonPrice} đ</Text>
                                    </View>
                                    <View style={styles.right}>
                                        <Text style={styles.totalprice}>{parseInt(item.Addonquantity) * parseInt(item.data.foodAddonPrice)} đ</Text>
                                    </View>
                                </View>
                                */}
                            </View>
                        )
                    }
                } />
                </ScrollView>
                
                <View style={hr80}>

                </View>
                <View style={styles.row}>
                    <View style={styles.left}>
                        <Text style={styles.title}>Tổng đơn:</Text>
                    </View>
                    <View style={styles.left}>
                        <Text style={styles.totalprice}>{formatcurr(totalCost)} đ</Text>
                    </View>
                </View>

                <View style={hr80}>
                </View>

                <View style={styles.userdataout}>
                    <Text style={styles.head1}>Thông tin của bạn</Text>
                    <View style={styles.row}>
                        <View style={styles.left}>
                            <Text style={styles.title}>Tên :</Text>
                        </View>
                        <View style={styles.right}>
                            <Text style={styles.title}>{userdata?.name}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.left}>
                            <Text style={styles.title}>Email :</Text>
                        </View>
                        <View style={styles.right}>
                            <Text style={styles.title}>{userdata?.email}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.left}>
                            <Text style={styles.title}>Số điện thoại :</Text>
                        </View>

                        <View style={styles.right}>
                            <Text style={styles.title}>{userdata?.phone}</Text>
                        </View>
                    </View>
                    {/** 
                    <View style={styles.row}>
                        <View style={styles.left}>
                            <Text style={styles.title}>Address :</Text>
                        </View>
                        <View style={styles.right}>
                            <Text style={styles.title}>{userdata?.address}</Text>
                        </View>
                    </View>
                    */}
                </View>

                <View style={hr80}></View>

                <View >
                    <TouchableOpacity style={btn1}>
                        <Text style={styles.btntext} onPress={() => placenow()}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default Placeorder

const styles = StyleSheet.create({

    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    head1: {
        fontSize: 30,
        fontWeight: '200',
        color: colors.text1,
        margin: 10,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        justifyContent: 'space-between',
    },
    rowout: {
        flexDirection: 'column',
        margin: 10,
        elevation: 10,
        backgroundColor: colors.col1,
        padding: 10,
        borderRadius: 10,
    },

    qty: {
        width: 40,
        height: 30,
        backgroundColor: colors.text1,
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 10,
        color: colors.col1,
        fontSize: 17,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        marginRight: 10,
    },
    price1: {
        fontSize: 17,
        fontWeight: 'bold',
        marginRight: 10,
        color: colors.text1,
    },
    left: {
        flexDirection: 'row',
    },
    right: {
        flexDirection: 'row',
    },
    totalprice: {
        fontSize: 17,
        fontWeight: 'bold',
        borderColor: colors.text1,
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
    },
    btntext: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.col1,
        margin: 10,
    }
})