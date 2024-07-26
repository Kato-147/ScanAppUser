import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DetailHistoryOrder = ({route}) => {
    const { item } = route.params;
    const historyOrderItems = item.items;

  return (
    <View>
    <Text>Transaction ID: {item.appTransactionId}</Text>
    <Text>Amount: {item.amount}</Text>
    <Text>Payment Method: {item.paymentMethod}</Text>
    <Text>Table Number: {item.tableNumber}</Text>
    <Text>User Order: {item.userOrder}</Text>
    <Text>User Pay: {item.userPay}</Text>
    <Text>ZP Transaction ID: {item.zpTransactionId}</Text>
    <Text>Created At: {item.createdAt}</Text>
    <Text> số lượng món {item.items.length}</Text>
  </View>
  )
}

export default DetailHistoryOrder

const styles = StyleSheet.create({})