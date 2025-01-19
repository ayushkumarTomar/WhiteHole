import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { s, vs } from 'react-native-size-matters'
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import ContextMenu from './contextMenu';
import useMediaStore from '@/store/queue';


const extractData = (data: any) => {
    return data.type === "song" ? `/music/${data.id}` : `${data.type}/${data.id}`;
};
const SearchResults = ({ continueListeningData, title }: any) => {
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [selectedSongId, setSelectedSongId] = useState<string | null>(null)
    const {addTrack}  = useMediaStore()

   const handleContextMenu = async(value:any , songId:string)=>{
       if(value==1) {
         await addTrack(songId , "playNext");
         ToastAndroid.show("Playing Next", ToastAndroid.SHORT)
       }
       if(value==2) {
         await addTrack(songId , "addToQueue");
         ToastAndroid.show("Added to Queue", ToastAndroid.SHORT)
       }
       if(value==3){
         if(selectedSongId) {
   
           //@ts-ignore
           router.push({pathname:`/(pages)/playlist/addToPlayList` , params:{songId:selectedSongId}})
         }
   
         
       }
     }

    const onLongPressSong = (songId: string) => {
        setSelectedSongId(songId);
        setContextMenuVisible(true);
    };
    const trendingItem = ({ item }: any) => {
        const title = item.title
        const type = item.type
        const imageLink = item.image.replace(/-(\d+)x(\d+)(?=\.\w+($|\?))/, "-500x500").replace("_50x50" , "_500x500");
        console.log("item is :: ", item)
        const redirectLink = extractData(item) || "/(tabs)/explore"
        return (
            <TouchableOpacity
                //@ts-ignore
                onPress={() => router.push(redirectLink)}
                onLongPress={() => type === "song" && onLongPressSong(item.id)}
            >
                <BlurView intensity={10} style={styles.itemTrending}>

                    <Image
                        source={{ uri: imageLink }}
                        style={{ alignSelf: 'center', width: vs(120), height: vs(120), borderRadius: vs(6) }}
                        resizeMode='contain'
                    />
                    <Text style={styles.itemTextTrending} numberOfLines={1} ellipsizeMode='tail'>
                        {title}
                    </Text>
                    <Text style={{ fontFamily: "Montserrat_500Medium", alignSelf: 'center', marginTop: vs(10), fontSize: vs(10), color: "#696969" }} numberOfLines={1} ellipsizeMode='tail'>
                        {type}
                    </Text>

                </BlurView>
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.continue}>
            <Text style={styles.continueText}>{title} </Text>
            <FlatList
                horizontal
                data={continueListeningData.data}
                renderItem={trendingItem}
            />

            <ContextMenu
                isVisible={contextMenuVisible}
                onClose={() => setContextMenuVisible(false)}
                onPlayNext={() => {
                    if (selectedSongId) {
                        handleContextMenu(1, selectedSongId);
                    }
                    setContextMenuVisible(false);
                }}
                onAddQueue={() => {
                    if (selectedSongId) {
                        handleContextMenu(2, selectedSongId);
                    }
                    setContextMenuVisible(false);
                }}
                onPlaylist={() => {
                    if (selectedSongId) {
                        handleContextMenu(3, selectedSongId);
                    }
                    setContextMenuVisible(false);
                }}
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
        fontSize: vs(13),
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
        height: vs(200),
        width: vs(140)


    },
    itemTextTrending: {
        marginTop: vs(10),
        marginBottom: vs(2),
        color: 'white',
        fontFamily: "Montserrat_600SemiBold",
        alignSelf: 'center',
        fontSize: vs(13)

    },

})



export default SearchResults