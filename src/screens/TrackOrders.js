import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import React, { useEffect, useState } from "react";
import HomeHeadNav from "../components/HomeHeadNav";
import BottomNav from "../components/BottomNav";
import { btn1, btn2, colors } from "../globals/style";
import { firebase } from "../../Firebase/firebaseConfig";

const TrackOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  const getorders = async () => {
    const ordersRef = firebase
      .firestore()
      .collection("UserOrders")
      .where("orderuseruid", "==", firebase.auth().currentUser.uid);
    ordersRef.onSnapshot((snapshot) => {
      setOrders(snapshot.docs.map((doc) => doc.data()));
    });
  };
  useEffect(() => {
    getorders();
  }, []);

  // console.log(orders)

  const convertDate = (date) => {
    // console.log(date.seconds)
    const newdate = new Date(date.seconds * 1000);
    // console.log(newdate)
    return newdate.toDateString();
  };
  function convertDate2(dateString) {
    const dateParts = dateString.split(" ");
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[3];
    return `${day}/${month}/${year}`;
  }

  const cancelOrder = (orderitem) => {
    const orderRef = firebase
      .firestore()
      .collection("UserOrders")
      .doc(orderitem.orderid);
    orderRef.update({
      orderstatus: "cancelled",
    });
    getorders();
  };

  const formatcurr = (n) => {
    return n
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
      .slice(0, -3);
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <HomeHeadNav navigation={navigation} />
      <View style={styles.bottomnav}>
        <BottomNav navigation={navigation} />
      </View>

      <ScrollView style={styles.containerin} nestedScrollEnabled={true}>
        <Text style={styles.head1}>Lịch sử đơn hàng</Text>
        <View>
          {orders
            .sort((a, b) => b.orderdate.seconds - a.orderdate.seconds)
            .map((order, index) => {
              return (
                <View style={styles.order} key={index}>
                  <Text style={styles.orderindex}>{index + 1}</Text>
                  <Text style={styles.ordertxt2}>
                    ID đơn hàng: {order.orderid}
                  </Text>
                  <Text style={styles.ordertxt2}>
                    Ngày đặt hàng: {convertDate2(convertDate(order.orderdate))}
                  </Text>
                  {order.orderstatus == "ontheway" && (
                    <Text style={styles.orderotw}>
                      Đơn hàng đang được giao{" "}
                    </Text>
                  )}
                  {order.orderstatus == "delivered" && (
                    <Text style={styles.orderdelivered}>
                      Đơn hàng đã hoàn thành{" "}
                    </Text>
                  )}
                  {order.orderstatus == "cancelled" && (
                    <Text style={styles.ordercancelled}>
                      Đơn hàng đã bị hủy{" "}
                    </Text>
                  )}
                  {order.orderstatus == "pending" && (
                    <Text style={styles.orderpending}>
                      Đơn hàng đang thực hiện{" "}
                    </Text>
                  )}
                  <View style={styles.line} />
                  <View style={styles.row1}>
                    <Text style={styles.ordertxt1}>
                      Nếu có thắc mắc, xin vui lòng liên hệ
                    </Text>
                    {order.deliveryboy_name ? (
                      <Text style={styles.ordertxt2}>
                        {order.deliveryboy_name} : {order.deliveryboy_contact}
                      </Text>
                    ) : (
                      <Text style={styles.ordertxt2}>
                        Name: Su Su {"\n"}Contact info: 0901349270
                      </Text>
                    )}
                    {order.deliveryboy_phone ? (
                      <Text style={styles.ordertxt2}>
                        {order.deliveryboy_phone}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.line} />

                  <View>
                    <ScrollView horizontal={true} style={{ width: "100%" }}>
                      <FlatList
                        style={styles.c1}
                        data={order.orderdata}
                        renderItem={({ item }) => {
                          return (
                            <View style={styles.rowout}>
                              <View style={styles.row}>
                                <View style={styles.left}>
                                  <Text style={styles.qty}>
                                    {item.Foodquantity}
                                  </Text>
                                  <Text style={styles.title}>
                                    {item.data.foodName}
                                  </Text>
                                </View>
                                <View style={styles.right}>
                                  <Text style={styles.price1}>
                                    {formatcurr(
                                      parseInt(item.Foodquantity) *
                                        parseInt(item.data.foodPrice),
                                      "VND"
                                    )}{" "}
                                    VNĐ
                                  </Text>
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
                          );
                        }}
                      />
                    </ScrollView>
                  </View>
                  <Text style={styles.total}>
                    Total: {formatcurr(parseInt(order.ordercost))} đ
                  </Text>
                  {order.orderstatus === "delivered" ? (
                    <Text style={styles.ordertxt3}>
                      Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
                    </Text>
                  ) : null}
                  {order.orderstatus === "pending" ? (
                    <Text style={styles.ordertxt3}>
                      Vui lòng chờ thức uống của bạn
                    </Text>
                  ) : null}
                  {order.orderstatus === "ontheway" ? (
                    <Text style={styles.ordertxt3}>
                      Vui lòng chờ thức uống của bạn
                    </Text>
                  ) : null}
                  {order.orderstatus === "cancelled" ? (
                    <Text style={styles.ordertxt3}>
                      Thành thực rất xin lỗi vì sự bất tiện này
                    </Text>
                  ) : null}
                  {order.orderstatus != "cancelled" &&
                  order.orderstatus != "delivered" ? (
                    <TouchableOpacity
                      style={styles.cancelbtn}
                      onPress={() => cancelOrder(order)}
                    >
                      <Text style={styles.cencelbtnin}>Hủy đơn hàng</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

function format2(n, currency) {
  return currency + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

export default TrackOrders;

const styles = StyleSheet.create({
  line: {
    marginTop: 10,
    opacity: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: 280,
    alignSelf: "center",
  },
  container: {
    // marginTop: 50,
    flex: 1,
    backgroundColor: colors.col1,
    // alignItems: 'center',
    width: "100%",
    height: "100%",
  },
  bottomnav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: colors.col1,
    zIndex: 20,
  },
  containerin: {
    marginTop: 10,
    flex: 1,
    backgroundColor: colors.col1,
    // alignItems: 'center',
    width: "100%",
    height: "100%",
    marginBottom: 100,
  },
  head1: {
    fontSize: 30,
    color: colors.text1,
    textAlign: "center",
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
  },
  rowout: {
    flexDirection: "column",
    margin: 10,
    elevation: 10,
    backgroundColor: colors.col1,
    padding: 10,
    borderRadius: 10,
  },
  row1: {
    flexDirection: "column",
    margin: 10,
    elevation: 10,
    backgroundColor: colors.col1,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  qty: {
    fontSize: 20,
    color: colors.text1,
    marginRight: 10,
  },
  title: {
    fontSize: 17,
    color: colors.text1,
    marginRight: 10,
  },
  price1: {
    fontSize: 17,
    color: colors.text1,
    marginRight: 10,
  },
  totalprice: {
    fontSize: 20,
    // color: colors.text1,
    marginRight: 10,
  },
  total: {
    fontSize: 20,
    color: colors.text3,
    textAlign: "right",
    marginVertical: 10,
    marginRight: 20,
  },
  order: {
    margin: 10,
    elevation: 10,
    backgroundColor: colors.col1,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.text1,
    borderWidth: 1,
    padding: 5,
  },
  ordertxt1: {
    fontSize: 20,
    color: colors.text1,
    textAlign: "center",
    marginVertical: 10,
  },
  ordertxt2: {
    fontSize: 17,
    color: colors.text3,
    textAlign: "center",
    marginVertical: 5,
    fontWeight: "bold",
  },
  orderindex: {
    fontSize: 20,
    color: colors.col1,
    backgroundColor: colors.text1,
    textAlign: "center",
    borderRadius: 30,
    padding: 5,
    //width: '20%',
    position: "absolute",
    top: 10,
    left: 10,
  },
  ordertxt3: {
    fontSize: 17,
    color: colors.text3,
    textAlign: "center",
    marginVertical: 5,
    borderColor: "#FF8000",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  cancelbtn: {
    backgroundColor: colors.text1,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  cencelbtnin: {
    fontSize: 20,
    color: colors.col1,
    textAlign: "center",
    fontWeight: "bold",
  },
  orderstatus: {
    // fontSize: 20,
  },
  orderstatusin: {},
  orderotw: {
    fontSize: 20,
    backgroundColor: "orange",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
    padding: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  orderdelivered: {
    fontSize: 20,
    backgroundColor: "green",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
    padding: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  ordercancelled: {
    fontSize: 20,
    backgroundColor: "red",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
    padding: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  orderpending: {
    fontSize: 20,
    backgroundColor: "yellow",
    color: "grey",
    textAlign: "center",
    borderRadius: 10,
    padding: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
});
