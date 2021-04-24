import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import Routes from './src/routes';
import { PlantProps } from './src/libs/storage';

import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';


export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  })

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data)
      }
    )
    return () => subscription.remove()

    // VISUALIZAR TODAS NOTIFICAÇÕES NO CONSOLE
    // async function notificationsAll() {
    //   const data = await Notifications.getAllScheduledNotificationsAsync()
    //   console.log('############### NOTIFICAÇÕES AGENDADAS ######################')
    //   console.log(data)
    // }
    // notificationsAll()

    // DELETAR TODAS AS NOTIFICAÇÕES
    // async function notificationDelete() {
    //   await Notifications.cancelAllScheduledNotificationsAsync();
    //   const data = await Notifications.getAllScheduledNotificationsAsync()
    //   console.log('############### NOTIFICAÇÕES AGENDADAS ######################')
    //   console.log(data)
    // }
    // notificationDelete()


  }, [])

  if (!fontsLoaded)
    return <AppLoading />

  return (
    <Routes />
  )
}
