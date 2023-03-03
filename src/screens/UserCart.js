import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { btn2, colors, hr80, navbtn, navbtnin } from "../globals/style";
import { AntDesign } from "@expo/vector-icons";
import { firebase } from "../../Firebase/firebaseConfig";
import BottomNav from "../components/BottomNav";

const UserCart = ({ navigation }) => {
  const [cartdata, setCartdata] = useState(null);
  const [totalCost, setTotalCost] = useState("0");

  const getcartdata = async () => {
    if(firebase.auth().currentUser.uid == "y5F8yXDGhjdJDf1PIDbAHesyYqs2")
    {
            Alert.alert("","You have to log in to use this feature",[
                {
                    text:'Login now',
                    onPress: () => navigation.navigate('login')
                },
                {
                    text: 'Maybe later',
                    onPress: () => navigation.goBack(),
                }
            ])
    }
    else
    {
        const docRef = firebase.firestore().collection('UserCart').doc(firebase.auth().currentUser.uid);
        console.log(firebase.auth().currentUser.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                const data = JSON.stringify(doc.data());
                setCartdata(data)
            } else {
                console.log('No such document!');
            }
        })
    }
}

  useEffect(() => {
    getcartdata();
  }, []);

  useEffect(() => {
    if (cartdata != null) {
      const foodprice = JSON.parse(cartdata).cart;
      let totalfoodprice = 0;
      foodprice.map((item) => {
        // console.log(item.data.foodPrice)
        totalfoodprice =
          parseInt(item.data.foodPrice) * parseInt(item.Foodquantity) +
          totalfoodprice;
      });
      // console.log(totalfoodprice)
      setTotalCost(JSON.stringify(totalfoodprice));
    }
  }, [cartdata]);
  // console.log(cartdata)

  // console.log(JSON.parse(cartdata).cart[0].data);
  const deleteAllItems = () => {
    const docRef = firebase
      .firestore()
      .collection("UserCart")
      .doc(firebase.auth().currentUser.uid);
    docRef.update({
      cart: [],
    });

    getcartdata();
  };

  const deleteItem = (item) => {
    const docRef = firebase
      .firestore()
      .collection("UserCart")
      .doc(firebase.auth().currentUser.uid);
    docRef.update({
      cart: firebase.firestore.FieldValue.arrayRemove(item),
    });

    getcartdata();
  };

  const formatcurr = (n) => {
    return String(
      parseInt(n)
        .toFixed(1)
        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    ).slice(0, -2);
  };
  // console.log(typeof (cartdata))

  const placeorderofcart = () => {
    if (cartdata == null || JSON.parse(cartdata).cart.length == 0) {
      Alert.alert("Đơn hàng trống", "Đơn hàng của bạn hiện đang trống", [
        {
          text: "OK",
        },
      ]);
    } else {
      Alert.alert("Đặt thành công", "Xác nhận thanh toán giỏ hàng", [
        {
          text: "OK",
        },
      ]);
      navigation.navigate("placeorder", { cartdata });
    }
    {
      /*
        JSON.parse(cartdata).cart.forEach(element => {
            deleteItem(element)
        });
        //setCartdata(null);
        //console.log(cartdata)
        */
    }
  };

  return (
    <View style={styles.containerout}>
      <TouchableOpacity onPress={() => navigation.navigate("home")}>
        <View style={navbtn}>
          <AntDesign name="back" size={24} color="black" style={navbtnin} />
        </View>
      </TouchableOpacity>
      <View style={styles.bottomnav}>
        <BottomNav navigation={navigation} />
      </View>
      <View style={styles.container}>
        <Text style={styles.head1}>Đơn hàng của bạn</Text>
        <View style={styles.cartout}>
          {cartdata == null || JSON.parse(cartdata).cart.length == 0 ? (
            <Text style={styles.head2}>Giỏ hàng hiện đang trống</Text>
          ) : (
            <ScrollView horizontal={true} style={{ width: "100%" }}>
              <FlatList
                style={styles.cardlist}
                data={JSON.parse(cartdata).cart}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.cartcard}>
                      <Image
                        source={{ uri: item.data.foodImageUrl }}
                        style={styles.cartimg}
                      />
                      <View style={{ flexDirection: "column" }}>
                        <View style={styles.cartcardin}>
                          <View style={styles.c1}>
                            <Text style={styles.txt1}>
                              {item.Foodquantity}&nbsp;{item.data.foodName}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text style={styles.txt2}>
                            {formatcurr(item.data.foodPrice)} VNĐ/ly
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.c4}
                          onPress={() => deleteItem(item)}
                        >
                          <Text style={styles.del}>Delete </Text>
                          <AntDesign
                            name="delete"
                            size={24}
                            color="black"
                            style={styles.del}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            </ScrollView>
          )}
        </View>
        <View style={styles.btncont}>
          <View style={styles.c3}>
            <Text style={styles.txt5}>Tổng: </Text>
            <Text style={styles.txt6}>{formatcurr(totalCost)} VNĐ</Text>
          </View>
          <TouchableOpacity style={btn2}>
            <Text style={styles.btntxt} onPress={() => placeorderofcart()}>
              Đặt
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.c4} onPress={() => deleteAllItems()}>
            <Text style={styles.del}>Delete All </Text>
            <AntDesign
              name="delete"
              size={24}
              color="black"
              style={styles.del}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserCart;

const styles = StyleSheet.create({
  containerout: {
    flex: 1,
    backgroundColor: colors.col1,
    // alignItems: 'center',
    width: "100%",
    // height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.col1,
    // alignItems: 'center',
    // justifyContent: 'center',
    width: "100%",
    // height: '100%',
  },
  head1: {
    marginTop: 5,
    fontSize: 40,
    textAlign: "center",
    fontWeight: "218",
    marginVertical: 20,
    marginHorizontal: 10,
    color: colors.text1,
  },
  head2: {
    marginTop: 80,
    fontSize: 30,
    textAlign: "center",
    fontWeight: "200",
    marginVertical: 20,
    elevation: 10,
    width: "90%",
    height: "50%",
    alignSelf: "center",
    paddingVertical: "25%",
    borderRadius: 10,
  },
  cartcard: {
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "row",
    backgroundColor: colors.col1,
    marginVertical: 5,
    borderRadius: 10,
    width: "95%",
    height: 150,
    alignSelf: "center",
    elevation: 10,
    alignItems: "center",
  },
  cartimg: {
    marginLeft: 10,
    marginRight: 10,
    width: 140,
    height: 140,
    borderRadius: 10,
    resizeMode: "center",
  },
  cartcardin: {
    flexDirection: "row",
    margin: 5,
    width: "58%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.text1,
  },
  cardlist: {
    width: 410,
  },
  cartout: {
    flex: 1,
    width: "100%",
  },
  btntxt: {
    color: colors.col1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
    borderRadius: 10,
    width: "90%",
    textAlign: "center",
  },
  btncont: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    flexDirection: "column",
    marginBottom: 80,
    borderTopColor: colors.text3,
    borderTopWidth: 0.2,
  },
  bottomnav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: colors.col1,
    zIndex: 20,
  },
  c1: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: colors.col1,
    borderRadius: 10,
    padding: 5,
  },
  txt1: {
    fontSize: 16,
    color: colors.text1,
    width: "200%",
    fontWeight: "bold",
  },
  del: {
    marginRight: 5,
    fontSize: 18,
    color: colors.text1,
    width: "60%",
    fontWeight: "bold",
  },
  txt2: {
    marginStart: 10,
    marginEnd: 10,
    fontSize: 16,
    color: colors.text3,
    fontWeight: "bold",
  },
  c2: {
    backgroundColor: colors.text1,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    flexDirection: "row",
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
    fontWeight: "bold",
  },
  c3: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
  },
  c4: {
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    borderRadius: 10,
    borderColor: colors.text1,
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
  },
  del: {
    color: colors.text1,
  },
});
