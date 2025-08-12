import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import OnboardingSwiper from './src/Navigation/onboardSwiper';

import { Provider } from 'react-redux';
import store from './src/redux/store/store';

import Home from './src/screens/Home';
import Login from './src/screens/Login';
import CameraScreen from './src/screens/CameraScreen';
import MobileNumVerify from './src/screens/MobileNumVerify';
import OtpPage from './src/screens/OtpPage';

import Timer from './src/screens/Timer';
import CandidateList from './src/screens/CandidateList';
import VoteVerification from './src/screens/VoteVerification';
import VotingSuccess from './src/screens/VotingSuccess';
import profile from './src/screens/profile';
import ViewResults from './src/screens/ViewResults';
import Notification from './src/screens/Notificaton';
import OnBoardingPage1 from './src/screens/OnBoardingPage1';
import OnBoardingPage2 from './src/screens/OnBoardingPage2';
import OnBoardingPage3 from './src/screens/OnBoardingPage3';

import ViewResultsPages from './src/screens/ViewResultsPages';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} />
          <Stack.Screen name="MobileNumVerify" component={MobileNumVerify} />
          <Stack.Screen name="OtpPage" component={OtpPage} />
          <Stack.Screen name="OnBoardingPage1" component={OnBoardingPage1} />
          <Stack.Screen name="OnBoardingPage2" component={OnBoardingPage2} />
          <Stack.Screen name="OnBoardingPage3" component={OnBoardingPage3} />
          <Stack.Screen name="Timer" component={Timer} />
          <Stack.Screen name="CandidateList" component={CandidateList} />
          {/* <Stack.Screen name="Onboarding" component={OnboardingSwiper} /> */}
          <Stack.Screen name="VoteVerification" component={VoteVerification} />
          <Stack.Screen name="VotingSuccess" component={VotingSuccess} />
          <Stack.Screen name="profile" component={profile}
          />
          <Stack.Screen
            name="ViewResultsPages"
            component={ViewResultsPages}
            options={{
              headerShown: true,
              title: 'Results',
            }}
          />
          <Stack.Screen
            name="ViewResults"
            component={ViewResults}
            options={{ headerShown: true, title: 'Results List' }}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
