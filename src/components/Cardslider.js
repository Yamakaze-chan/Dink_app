import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { colors, veg, nonveg } from "../globals/style";
import { firebase } from "../../Firebase/firebaseConfig";
import React, { useState } from "react";
const Cardslider = ({ title, navigation, data }) => {
  const [ischecked, setischecked] = useState(false);
  const [quantity, setquantity] = useState("1");
  const [addonquantity, setaddonquantity] = useState("0");

  const addTocart = (item) => {
    const docRef = firebase
      .firestore()
      .collection("UserCart")
      .doc(firebase.auth().currentUser.uid);

    const data1 = {
      data: item,
      Addonquantity: addonquantity,
      Foodquantity: quantity,
    };
    console.log(data1);

    docRef.get().then((doc) => {
      if (doc.exists) {
        docRef.update({
          cart: firebase.firestore.FieldValue.arrayUnion(data1),
        });
        console.log("Updated");
      } else {
        docRef.set({
          cart: [data1],
        });
        console.log("Added");
      }
      Alert.alert("Thành công", "Đã thêm vào giỏ hàng");
    });
  };

  const increaseQuantity = () => {
    setquantity((parseInt(quantity) + 1).toString());
  };

  const increaseAddonQuantity = () => {
    setaddonquantity((parseInt(addonquantity) + 1).toString());
  };
  const decreaseAddonQuantity = () => {
    if (parseInt(addonquantity) > 0) {
      setaddonquantity((parseInt(addonquantity) - 1).toString());
    }
  };

  const cartdata = JSON.stringify({
    cart: [{ Addonquantity: addonquantity, Foodquantity: quantity, data }],
  });

  const openProductPage = (item) => {
    // console.log('clicked ', item)
    navigation.navigate("productpage", item);
  };
  const formatcurr = (n) => {
    return String(n.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")).slice(
      0,
      -2
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.cardouthead}>{title}</Text>
      <FlatList
        style={styles.cardsout}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.index}
            onPress={() => {
              openProductPage(item);
            }}
          >
            <View style={styles.card}>
              <View style={styles.s1}>
                <Image
                  source={{
                    uri: item.foodImageUrl,
                  }}
                  style={styles.cardimgin}
                />
              </View>
              <View style={styles.s2}>
                <Text style={styles.txt1}>{item.foodName}</Text>
              </View>
              <View style={styles.s2in}>
                <Text style={styles.txt2}>
                  {formatcurr(parseInt(item.foodPrice))} VNĐ
                </Text>
                {/*
                                    {item.foodType == 'veg' ? <Text style={veg}></Text> : <Text style={nonveg}></Text>}
                                    */}
              </View>
              <TouchableOpacity
                style={styles.s3}
                onPress={() => {
                  addTocart(item);
                }}
              >
                <Text style={styles.buybtn}>Thêm vào đơn</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Cardslider;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  //card
  cardouthead: {
    backgroundColor: "#FFE4B5",
    color: colors.text3,
    width: "30%",
    fontSize: 30,
    fontWeight: "300",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  cardsout: {
    width: "100%",
    // backgroundColor: 'red',
  },
  card: {
    // backgroundColor: "aqua",
    width: 300,
    height: 300,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    backgroundColor: colors.col1,
  },
  cardimgin: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  s2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'aqua',
  },
  txt1: {
    fontSize: 18,
    color: colors.text3,
    marginHorizontal: 10,
    marginBottom: 5,
    width: 250,
  },
  txt2: {
    fontSize: 18,
    color: colors.text2,
  },
  s2in: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  s3: {
    alignItems: "center",
    position: "absolute",
    bottom: 1,
    width: "100%",
  },
  buybtn: {
    margin: 10,
    backgroundColor: "#006400",
    color: colors.col1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 20,
    borderRadius: 10,
    width: "90%",
    textAlign: "center",
  },
});
