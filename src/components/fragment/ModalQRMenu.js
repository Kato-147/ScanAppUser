import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ModalQRMenu = ({setshowModal}) => {
  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setshowModal(false)}>
        <TouchableWithoutFeedback onPress={() => setshowModal(false)}>
          <View style={styles.modalContainer}>
            
          </View>
        </TouchableWithoutFeedback>
      </Modal>
  );
};

export default ModalQRMenu;

const styles = StyleSheet.create({});
