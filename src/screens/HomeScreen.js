import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import HomeHeadNav from "../components/HomeHeadNav";
import Categories from "../components/Categories";
import OfferSlider from "../components/OfferSlider";
import { AntDesign } from "@expo/vector-icons";
import { colors, veg, nonveg } from "../globals/style";

import { firebase } from "../../Firebase/firebaseConfig";
import Cardslider from "../components/Cardslider";
import BottomNav from "../components/BottomNav";
import { windowHeight } from "../components/BottomNav";

const HomeScreen = ({ navigation }) => {
  const [foodData, setFoodData] = useState([]);
  const [teaData, setTeaData] = useState([]);
  const [coffeeData, setCoffeeData] = useState([]);
  const [toppingData, setToppingData] = useState([]);

  const foodRef = firebase.firestore().collection("FoodData");

  useEffect(() => {
    foodRef.onSnapshot((snapshot) => {
      setFoodData(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  useEffect(() => {
    setTeaData(foodData.filter((item) => item.foodType == "Trà"));
    setCoffeeData(foodData.filter((item) => item.foodType == "Coffee"));
    setToppingData(foodData.filter((item) => item.foodType == "Topping"));
  }, [foodData]);
  // console.log(foodData)
  // console.log(VegData)

  // search box
  const [search, setSearch] = useState("");

  // console.log(windowHeight)
  const formatcurr = (n) => {
    return String(
      parseInt(n)
        .toFixed(1)
        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    ).slice(0, -2);
  };

  return (
    <View style={styles.container}>
      <StatusBar />

      <HomeHeadNav navigation={navigation} />

      <View style={styles.bottomnav}>
        <BottomNav navigation={navigation} />
      </View>

      <ScrollView>
        <ImageBackground
          source={require("../../assets/487498cf-8055-4faa-b835-710d05601f53.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.searchbox}>
            <AntDesign
              name="search1"
              size={24}
              color="black"
              style={styles.searchicon}
            />
            <TextInput
              style={styles.input}
              placeholder="Search"
              onChangeText={(e) => {
                setSearch(e);
              }}
            />
          </View>
          {search != "" && ( //<View style={styles.seacrhresultsouter}>
            <ScrollView
              horizontal={true}
              style={{ width: "100%" }}
              isUserInteractionEnabled={true}
            >
              <FlatList
                style={styles.searchresultsinner}
                data={foodData}
                renderItem={({ item }) => {
                  if (
                    item.foodName.toLowerCase().includes(search.toLowerCase())
                  ) {
                    const drink = () => {
                      navigation.navigate("productpage", item);
                    };
                    return (
                      <TouchableOpacity onPress={drink}>
                        <View style={styles.searchresult}>
                          <Image
                            source={{ uri: item.foodImageUrl }}
                            style={styles.cartimg}
                          />
                          <View style={{ flexDirection: "column" }}>
                            <View style={styles.cartcardin}>
                              <View style={styles.c1}>
                                <Text style={styles.txt1}>{item.foodName}</Text>
                              </View>
                            </View>
                            <View>
                              <Text style={styles.txt2}>
                                {formatcurr(item.foodPrice)} VNĐ/ly
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                }}
              />

              {/* </View>} */}
            </ScrollView>
          )}
          <Categories />
          <OfferSlider />
          {/* <Text>HomeScreen</Text> */}

          <Cardslider
            title={"Special"}
            data={foodData}
            navigation={navigation}
          />
          <Cardslider
            title={"Coffee"}
            data={coffeeData}
            navigation={navigation}
          />
          <Cardslider title={"Trà"} data={teaData} navigation={navigation} />
          <Cardslider
            title={"Topping"}
            data={toppingData}
            navigation={navigation}
          />
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 50,
    flex: 1,
    backgroundColor: colors.col1,

    // alignItems: 'center',
    width: "100%",
    height: "100%",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  searchbox: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: colors.col1,
    borderRadius: 30,
    alignItems: "center",
    padding: 10,
    margin: 20,
    elevation: 10,
  },
  txt2: {
    marginTop: 5,
    marginStart: 10,
    fontSize: 16,
    color: colors.text3,
    fontWeight: "bold",
  },
  c1: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 10,
    padding: 5,
  },
  buybtn: {
    margin: 10,
    backgroundColor: "#006400",
    color: colors.col1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 20,
    borderRadius: 10,
    width: "90%",
    textAlign: "center",
  },
  txt1: {
    fontSize: 16,
    color: colors.text1,
    width: "200%",
    fontWeight: "bold",
  },
  input: {
    marginLeft: 10,
    width: "90%",
    fontSize: 18,
    color: colors.text1,
  },
  cartcardin: {
    flexDirection: "row",
    margin: 5,
    width: "58%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.text1,
  },
  searchicon: {
    color: colors.cafe_title,
  },
  cartimg: {
    marginLeft: 10,
    marginRight: 10,
    width: 140,
    height: 140,
    borderRadius: 10,
    resizeMode: "center",
  },
  seacrhresultsouter: {
    width: "100%",
    marginHorizontal: 30,
    height: "100%",
    backgroundColor: colors.col1,
  },
  searchresulttextPrice: {
    marginLeft: 10,
    fontSize: 20,
    color: "#CC0000",
  },
  searchresultsinner: {
    width: 410,
  },
  searchresult: {
    width: 410,
    flexDirection: "row",
    margin: 10,
  },
  searchresulttext: {
    marginLeft: 10,
    marginVertical: 10,
    fontSize: 18,
    color: "#873600",
    flexDirection: "row",
  },
  bottomnav: {
    marginTop: 20,
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.col1,
    zIndex: 20,
    flex: 1,
    left: 0,
    right: 0,
  },
});
export default HomeScreen;
