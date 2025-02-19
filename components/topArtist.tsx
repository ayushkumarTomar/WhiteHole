import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { s, vs } from 'react-native-size-matters'
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { TopArtistItem, TopArtistsResponse } from '@/types/artists';
import useLazyLoad from '@/hooks/useLazyLoad';

const TopArtist = ({ data , title }: {data:TopArtistsResponse , title:string}) => {
    const { data: lazyData, loadMore, isLoading } = useLazyLoad(data.top_artists, 5);


    const trendingItem = ({ item }: {item:TopArtistItem}) => {

        
        
        const itemHeight = item.name ? vs(145) : vs(135);
        return (
            //@ts-ignore
            <BlurView intensity={10} style={[styles.itemTrending , {height: itemHeight}]}   onTouchEnd={() => router.push(`/(pages)/artist/${item.artistid}` || "/(tabs)/home")} >
                
                <Image
                    source={{ uri: item.image.replace('_150x150', '_500x500') }}
                    style={{ alignSelf: 'center', width: vs(90), height: vs(90), borderRadius: vs(45) }}
                    resizeMode='contain'
                />
                <Text style={styles.itemTextTrending} numberOfLines={1} ellipsizeMode='tail'>
                    {item.name}
                </Text>
                
           
            </BlurView>
        );
    };
    
    return (
        <View style={styles.continue}>
            <Text style={styles.continueText}>{title} </Text>
            <FlatList
                horizontal
                data={lazyData}
                keyExtractor={(item) => item.name}
                renderItem={trendingItem}
                onEndReached={loadMore}
                onEndReachedThreshold={0.9}
                ListFooterComponent={
                    isLoading ?<View style={styles.loadingContainer}>
                    <ActivityIndicator style={{alignSelf:'center' , alignContent:'center'}} size="large" color="white" />
                </View>:null    
                    }
                />

        </View>


    )
  
}
const styles = StyleSheet.create({
    continue: {
        marginTop: vs(10), 
        paddingLeft: s(10),
    },
    continueText: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: vs(20),
        color: 'white',
        marginBottom: vs(10)
    },
    itemTrending: {
        marginRight: 10,
        padding: s(10),
        backgroundColor: 'transparent',
        // elevation:1 ,
        margin: vs(3),
        borderRadius: vs(20),
        // gap: s(10),
        // height: vs(160),
        width: vs(120)


    },
    itemTextTrending: {
        marginTop: vs(10),
        marginBottom: vs(2),
        color: 'white',
        fontFamily: "Montserrat_600SemiBold",
        alignSelf: 'center',
        fontSize: vs(10)

    },
    loadingContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: vs(55),
        paddingHorizontal: s(10),
        // alignContent:'center'
    },

})



export default TopArtist