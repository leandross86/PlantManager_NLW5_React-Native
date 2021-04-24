import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { format, isBefore } from 'date-fns';
import { useNavigation, useRoute } from '@react-navigation/core';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import {SvgFromUri} from 'react-native-svg';

import { PlantProps, savePlant } from '../libs/storage';
import { Button } from '../components/Button';
import waterdrop from '../assets/waterdrop.png'

import colors from '../styles/colors';
import fonts from '../styles/fonts';


interface Params {
  plant: PlantProps
}

export function PlantSave() {
  const [seletedDateTime, setSeletedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  const route = useRoute()
  const navigation = useNavigation()
  const {plant} = route.params as Params;

  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if(Platform.OS === 'android') {
      setShowDatePicker((oldState) => !oldState)
    }

    if(dateTime && isBefore(dateTime, new Date())) {
      setSeletedDateTime(new Date())
      return Alert.alert('Escolha uma hora no futuro 🕓')
    }

    if(dateTime)
      setSeletedDateTime(dateTime)
  }

  function handleOpenDatePickerForAndroid() {
    setShowDatePicker((oldState) => !oldState)
  }

  async function handleSave() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: seletedDateTime,
      })
      navigation.navigate('Confirmation', {
        title: 'Tudo Certo',
        subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
        buttonTitle: 'Muito Obrigado',
        icon: 'hug',
        nextScreen: 'MyPlants'
      })
    } catch {
      Alert.alert('Não foi possível salvar. 😬')
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >

      <View style={styles.container}>
        <View style={styles.plantInfo}>
          <SvgFromUri 
            uri={plant.photo}
            height={150}
            width={150}
          />
          <Text style={styles.plantName}>
            {plant.name}
          </Text>
          <Text style={styles.plantAbout}>
            {plant.about}
          </Text>
        </View>

        <View style={styles.controller}>
          <View style={styles.tipContainer}>
            <Image 
              source={waterdrop}
              style={styles.tipImage}
            />
            <Text style={styles.tipText}>
              {plant.water_tips}
            </Text>
          </View>

          <Text style={styles.alertLabel}>
            Escolha o melhor horário para ser lembrado:
          </Text>

          {
            showDatePicker &&
            <DateTimePicker
            value={seletedDateTime}
            mode="time"
            display="spinner"
            onChange={handleChangeTime}
          />
          }

          {
            Platform.OS === 'android' && (
              <TouchableOpacity
                style={styles.dateTimePickerButton}
                onPress={handleOpenDatePickerForAndroid}
              >
                <Text style={styles.dateTimePickerText}>
                  {`Mudar ${format(seletedDateTime, 'HH:mm')}`}
                </Text>
              </TouchableOpacity>
            )
          }

          <Button 
            title="Cadastrar planta"
            onPress={handleSave}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.shape,
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15
  },
  plantAbout: {
    textAlign: 'center',
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    bottom: 60
  },
  tipImage: {
    width: 56,
    height: 56
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'justify'
  },
  alertLabel: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5
  },
  dateTimePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text
  }
})