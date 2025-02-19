import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useFonts , Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import AntDesign from '@expo/vector-icons/AntDesign';
import { View , StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {vs} from "react-native-size-matters"
import {BottomTabBar} from "@react-navigation/bottom-tabs"
import Player from '@/components/player';

export default function TabLayout() {
    const [fontsLoaded] = useFonts({
        Montserrat_500Medium
      });
    
    
      if (!fontsLoaded) {
        return null;
      }   

    

    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: '#00C2CB',
            tabBarStyle: {
              position: 'absolute',
              paddingBottom:vs(3) ,
              overflow: 'hidden', 
              borderTopWidth:0 ,
              borderBottomWidth:0 ,
              backgroundColor: 'transparent',
              elevation: 0,
            },
           
            
            tabBarLabelStyle: {
              fontFamily: 'Montserrat_500Medium',
              color:'white'
            },
            tabBarBackground : ()=> (
                <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 1)']} 
              style={styles.gradient} 
            />
            ),
            // tabBarBackground: () => (
            //     <BlurView
            //     intensity={80} 
            //     tint='systemMaterialDark'
            //     style={{
            //         ...StyleSheet.absoluteFillObject ,
            //         overflow:"hidden" ,
            //     }}
            //     />
            // ),
          }}
          tabBar={(props) => (
            <View>
              <Player />
              <BottomTabBar {...props} />
            </View>
          )}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarLabel:"Home" ,

                    tabBarIcon: ({ focused }) => <AntDesign name="home" size={24} color={focused ? '#00C2CB' : 'white'} />
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ focused }) => <AntDesign name="search1" size={24} color={focused ? '#00C2CB' : 'white'} />

                }}
            />
            
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Library',
                    tabBarIcon: ({ focused }) => <AntDesign name="folder1" size={24} color={focused ? '#00C2CB' : 'white'} />
                }}
            />
        </Tabs>
    );
}
const styles = StyleSheet.create({
    tabBarContainer: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
      overflow: 'hidden',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 60,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
  });