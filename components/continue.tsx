import { View, Text , StyleSheet, ScrollView, FlatList , Image , TouchableOpacity } from 'react-native'
import { s, vs } from 'react-native-size-matters'
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import { Track } from '@/lib/mediaProcess';


const Item = ({item} : {item:Track}) => (
    <BlurView intensity={10} style={styles.item}>
      <Link href={{pathname:'/(pages)/music/[musicId]' , params:{musicId:item.songId}}} asChild>
        <TouchableOpacity style={{flexDirection:'row' , gap:s(10)}}>
        <Image source={{ uri: item.artwork }} style={{ width: vs(30), height: vs(30), borderRadius: vs(6) }} resizeMode='contain' />
        {item.title && <Text style={styles.itemText}>{item.title.length > 15 ? item.title.substring(0, 15) + "..." : item.title}</Text>}
        </TouchableOpacity>
        </Link>
    </BlurView>
);
const ContinueChart = ({continueListeningData}:{continueListeningData : Track[]}) => {
  return (
    <View style={styles.continue}>
            <Text style={styles.continueText}>Continue Listening</Text>

            <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} >
              <FlatList
                data={continueListeningData}
                renderItem={({ item })=> <Item item={item} />}
                numColumns={Math.ceil(continueListeningData.length / 2)}
                scrollEnabled={false}
                ListEmptyComponent={<Text style={styles.emptyText}>No Last Session History</Text>}
              />

            </ScrollView>
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
      emptyText: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: vs(14),
        color: 'white',
        marginBottom: vs(10)
      },
      item: {
        flexDirection: 'row',
        padding: s(10),
        backgroundColor: 'transparent',
        // elevation:1 ,
        margin: vs(3),
        borderRadius: vs(20),
        gap: s(10),
    
      },
      itemText: {
        color: 'white',
        fontFamily: "Montserrat_600SemiBold",
        alignSelf: 'center',
        fontSize: vs(8)
    
      },
})



export default ContinueChart