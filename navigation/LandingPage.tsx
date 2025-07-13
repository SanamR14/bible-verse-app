import React from 'react';
import { PaperProvider } from 'react-native-paper';
import LandingPageStack from './LandingStack';
import Header from '../screens/header';


const LandingPage = () => {
  return (
    <PaperProvider>
            <Header />
            <LandingPageStack />
      </PaperProvider>
  )
}

export default LandingPage