import { View, Text, StyleSheet, FlatList, Image } from 'react-native'
import React from 'react'
import { s, vs } from 'react-native-size-matters'
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import {LanguageFooter , Item} from '@/types/launchData';

type LanguageItem = Item & {
    type:string;

}
const LanguageFooter = ({ data , title }: {data:LanguageFooter , title:string}) => {
    const combinedData: LanguageItem[] = [
        ...data.playlist.map(item => ({ ...item, type: 'playlist' })),
        ...data.album.map(item => ({ ...item, type: 'album' })),
      ].slice(0, 10); 
    




    const renderItem = ({ item }: { item: LanguageItem }) => {
        const itemHeight = item.title ? vs(160) : vs(145);
        const handlePress = () => {
            if (item.type === 'playlist') {
              router.push(`/playlist/${item.id}`);
            } else if (item.type === 'album') {
              router.push(`/album/${item.id}`);
            }
          };
        return (
          <BlurView
            intensity={10}
            style={[styles.itemTrending, { height: itemHeight }]}
            onTouchEnd={handlePress}
          >
            {item.image && (
              <Image
                source={{ uri: item.image.replace('_150x150', '_500x500') }}
                style={{
                  alignSelf: 'center',
                  width: vs(100),
                  height: vs(100),
                  borderRadius: vs(6),
                }}
                resizeMode="contain"
              />
            )}
            <Text style={styles.itemTextTrending} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={styles.itemType}>
              {item.type === 'playlist' ? 'Playlist' : 'Album'}
            </Text>
          </BlurView>
        );
      };
    
    return (
        <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                    <FlatList
                        horizontal
                        data={combinedData}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                    />

        </View>


    )
  
}
const styles = StyleSheet.create({
    container: {
      marginTop: vs(10),
      paddingLeft: s(10),
    },
    title: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: vs(20),
      color: 'white',
      marginBottom: vs(10),
    },
    itemTrending: {
      marginRight: 10,
      padding: s(10),
      backgroundColor: 'transparent',
      margin: vs(3),
      borderRadius: vs(20),
      width: vs(120),
    },
    itemTextTrending: {
      marginTop: vs(10),
      marginBottom: vs(2),
      color: 'white',
      fontFamily: 'Montserrat_600SemiBold',
      alignSelf: 'center',
      fontSize: vs(10),
    },
    itemType: {
      fontSize: vs(8),
      color: 'gray',
      textAlign: 'center',
      marginTop: vs(2),
    },
  });



export default LanguageFooter