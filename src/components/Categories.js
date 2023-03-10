import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { colors } from "../globals/style";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Cardslider from "./Cardslider";

const Categories = ({ ref, navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.head}>Categories</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.box}>
          <MaterialCommunityIcons
            name="coffee"
            size={24}
            color="black"
            style={styles.myicon}
          />
          <Text style={styles.mytext}>Cà phê</Text>
        </View>

        <View style={styles.box}>
          <MaterialCommunityIcons
            name="tea"
            size={24}
            color="black"
            style={styles.myicon}
          />
          <Text style={styles.mytext}>Trà</Text>
        </View>

        <View style={styles.box}>
          <MaterialCommunityIcons
            name="food-fork-drink"
            size={24}
            color="black"
            style={styles.myicon}
          />
          <Text style={styles.mytext}>Topping</Text>
        </View>

        <View style={styles.box}>
          <MaterialCommunityIcons
            name="cupcake"
            size={24}
            color="black"
            style={styles.myicon}
          />
          <Text style={styles.mytext}>Đồ ăn</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: colors.col1,
    width: "100%",
    // height: 100,
    // alignItems: 'center',
    //elevation: 10,
    borderRadius: 10,
  },
  head: {
    color: colors.cafe_title,
    fontSize: 40,
    fontWeight: "500",
    margin: 10,
    alignSelf: "center",
    paddingBottom: 5,
    borderBottomColor: colors.text1,
    borderBottomWidth: 1,
  },
  box: {
    backgroundColor: colors.col1,
    elevation: 20,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  myicon: {
    marginRight: 10,
    color: colors.text3,
  },
  mytext: {
    color: colors.text3,
  },
});
