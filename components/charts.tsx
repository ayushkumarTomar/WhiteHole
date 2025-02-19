import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { s, vs } from 'react-native-size-matters'
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import useLazyLoad from '@/hooks/useLazyLoad';

type ChartType = "new_trending" | "top_playlists" | "new_albums" | "browse_discover" | "global_config" | "charts" | "radio" 
const extractData = (type :ChartType , data:any)=>{
    let artists , title , imageLink50 , imageLink , redirectLink
    if(type == "new_trending"){
        imageLink50 = data.details.image
        if(data.type=="playlist"){
            title = data.details.listname
            artists = data.details.firstname
            redirectLink = `${data.type}/${data.details.listid}`

        }
        else if(data.type == "album"){
            title = data.details.title
            artists = data.details.artist.name
            redirectLink = `${data.type}/${data.details.albumid}`

        }
        else if(data.type=="song"){
            artists = data.details.primary_artists
            title = data.details.song
            redirectLink = `$music/${data.details.id}`
        }
    }

    else if(type =="top_playlists"){
        imageLink50 = data.image
        title = data.listname
        artists = data.firstname
        redirectLink = `playlist/${data.listid}`

    }
    else if (type == "new_albums"){

        imageLink50 = data.image
        title = data.title
        redirectLink = `album/${data.albumid}`
        if (data.Artist && data.Artist.music && data.Artist.music.length>0) artists = data.Artist.music.map((artist:any)=>artist.name).join(", ")
        else artists = data.query
        }
    else if (type == "global_config"){
        imageLink50 = data.image


    }
    else if (type == "browse_discover"){
        imageLink50 = data.image
        title = data.title
        imageLink = data.image
        redirectLink = `${data.type}/${data.id}`



    }
    else if (type == "charts"){
        imageLink50 = data.image
        title = data.title
        redirectLink = `${data.type}/${data.id}`



    }
    else if (type == "radio"){
        imageLink50 = data.image
        title = data.name
        redirectLink = `${data.type}/${data.albumid}`


    }
    else{
        imageLink50 = data.image

    }
    imageLink = imageLink50.replace(/-(\d{3})x(\d{3})(?=\.\w+($|\?))/, "-500x500");
    return {
        imageLink ,
        artists ,
        title ,
        redirectLink
    }

}



const TrendingChart = ({ continueListeningData , title , type }: any) => {
    const { data, loadMore, isLoading } = useLazyLoad(continueListeningData, 5);
    const trendingItem = ({ item }: any) => {
        const {artists , title , imageLink , redirectLink} = extractData(type ,item)  
        
        const itemHeight = artists ? vs(160) : vs(145);
        return (
            //@ts-ignore
            <BlurView intensity={10} style={[styles.itemTrending , {height: itemHeight}]}   onTouchEnd={() => router.push(redirectLink || "/(tabs)/home")} >
                
                <Image
                    source={{ uri: imageLink }}
                    style={{ alignSelf: 'center', width: vs(100), height: vs(100), borderRadius: vs(6) }}
                    resizeMode='contain'
                />
                <Text style={styles.itemTextTrending} numberOfLines={1} ellipsizeMode='tail'>
                    {title}
                </Text>
                {artists!=undefined && <Text style={{ fontFamily: "Montserrat_500Medium", alignSelf:'center' , fontSize: vs(7), color: "#696969" }} numberOfLines={1} ellipsizeMode='tail'>
                    {artists}
                </Text>}
           
            </BlurView>
        );
    };
    
    return (
        <View style={styles.continue}>
            <Text style={styles.continueText}>{title} </Text>
            <FlatList
                horizontal
                data={data}
                renderItem={trendingItem}
                keyExtractor={(item, index) => `${type}-${index}`}
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



export default TrendingChart