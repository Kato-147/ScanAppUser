import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  UIManager,
  Platform,
  LayoutAnimation,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AccodianHelp = ({title, description}) => {
  const [opened, setOpened] = useState(false);

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  function toggleAccordion() {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {type: 'easeIn', property: 'opacity'},
      update: {type: 'linear', springDamping: 0.3, duration: 250},
    });
    setOpened(!opened);
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={styles.header}>
          <View style={{width:wp(75)}} >
            <Text style={styles.title}> {title} </Text>
          </View>

          <Icon name={opened ? 'caretup' : 'caretdown'} size={wp(4.5)} />
        </View>
      </TouchableWithoutFeedback>

      {opened && (
        <View style={[styles.content]}>
          <Text style={{letterSpacing: 0.75}}>{description}</Text>
        </View>
      )}
    </View>
  );
};

export default AccodianHelp;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8900C',
  },
  header: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(85)
  },
  details: {
    opacity: 0.65,
  },
  title: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: hp(2.2),
  },
  content: {
    marginTop: 8,
  },
});
