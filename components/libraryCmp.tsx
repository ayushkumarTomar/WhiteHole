import { View, Text, StyleSheet, FlatList, Image } from 'react-native'
import { s, vs } from 'react-native-size-matters'
import { BlurView } from 'expo-blur';

const libraryItem = ({ item }: any) => {
        
    const itemHeight = vs(120)
    return (
        <BlurView intensity={10} style={[styles.itemTrending , {height: itemHeight}]}>
            
            <Image
                source={{ uri: item.artwork }}
                style={{ alignSelf: 'center', width: vs(80), height: vs(80), borderRadius: vs(5) }}
                resizeMode='contain'
            />
            <Text style={styles.itemTextTrending} numberOfLines={1} ellipsizeMode='tail'>
                {item.title}
            </Text>

        </BlurView>
    );
};
const LibraryChart = ({ continueListeningData , title , type }: any) => {

    if (type=="lastSession"){

        return (
            <View style={styles.continue}>
                <Text style={styles.continueText}>{title} </Text>
                <FlatList
                    horizontal
                    data={continueListeningData}
                    renderItem={libraryItem}
                />
    
            </View>
        )
        

    }
    else {
        return (
            <View style={styles.continue}>
                <Text style={styles.continueText}>{title} </Text>
                <FlatList
                    horizontal
                    data={continueListeningData}
                    renderItem={libraryItem}
                />
    
            </View>
    
    
        )
    }
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
        padding: s(7),
        backgroundColor: 'transparent',
        // elevation:1 ,
        margin: vs(3),
        borderRadius: vs(20),
        // gap: s(10),
        // height: vs(160),
        width: vs(110)


    },
    itemTextTrending: {
        marginTop: vs(10),
        marginBottom: vs(2),
        color: 'white',
        fontFamily: "Montserrat_600SemiBold",
        alignSelf: 'center',
        fontSize: vs(8)

    },

})



export default LibraryChart