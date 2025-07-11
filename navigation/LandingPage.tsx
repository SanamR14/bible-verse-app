import React from 'react'
import MainTabs from './MainTabs'
import { PaperProvider } from 'react-native-paper'
import Header from '../screens/header'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from '../screens/Menu';
import LandingPageStack from './LandingStack';


const LandingPage = () => {
  return (
    <PaperProvider>
            <Header />
            <LandingPageStack />
      </PaperProvider>
  )
}

export default LandingPage