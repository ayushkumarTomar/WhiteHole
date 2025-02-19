import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { Montserrat_700Bold, useFonts, Montserrat_600SemiBold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import ContinueChart from '@/components/continue';
import TrendingChart from '@/components/charts';
import { useQuery } from '@tanstack/react-query';
import { getModules, getTopArtists } from '@/lib/api';
import Loading from '@/components/loading';
import { getLastSession, getUsername, saveUsername } from '@/lib/storage';
import { launchData } from '@/types/launchData';
import TopArtist from '@/components/topArtist';
import { TopArtistsResponse } from '@/types/artists';
import { Track } from '@/lib/mediaProcess';
import { getQuality } from '@/lib/shared';

const Home = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium,
  });

  const [continueListeningData, setContinueListeningData] = useState<Track[]>([]);
  const { data, error, isLoading } = useQuery<launchData, Error>({
    queryKey: ['modules'],
    queryFn: getModules,
  });

  const { data:TopArtistData} = useQuery<TopArtistsResponse, Error>({
    queryKey: ['topartists'],
    queryFn: getTopArtists,
  });

  const [username , setUsername] = useState<string>("Tangerine");
  const [modalVisible, setModalVisible] = useState(false);
  const [quality, setQuality] = useState<'96' | '160' | '320'>('320');


  const [tempName , setTempName] = useState<string>(username);
  useEffect(() => {
    const fetchLastSession = async () => {
      setContinueListeningData(await getLastSession());
      setUsername(await getUsername());
      setQuality(await getQuality());
    };
    fetchLastSession();
  }, []);
  const [showQualityPicker, setShowQualityPicker] = useState(false);

  const comingSoon = useCallback(() => {
    ToastAndroid.show("Coming Soon !!" , ToastAndroid.SHORT)} , []);

  if (isLoading || !fontsLoaded || !data) return <Loading />;
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Error: {error.message}</Text>
      </View>
    );
  }

  const handleConfirmNameChange = () => {
    setUsername(tempName);
    setModalVisible(false);
    saveUsername(tempName);
    if(quality!='320') setQuality(quality);   
  };

  


  const { new_trending, top_playlists, new_albums, charts} = data;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <ScrollView>
          <View style={styles.header}>
            <SimpleLineIcons name="music-tone-alt" size={24} color="white" />
            <Text style={styles.headerText}>
              Welcome back!{"\n"}
              <Text style={[styles.headerText, { fontSize: vs(20) }]} onPress={() => setModalVisible(true)}>
                {username}
              </Text>
            </Text>

            <View style={styles.headerIcons}>
              <Feather name="bar-chart-2" size={18} color="white" onPress={comingSoon} />
              <Feather name="bell" size={18} color="white" onPress={comingSoon} />
              <Ionicons name="settings-outline" size={18} color="white" onPress={() => setModalVisible(true)} />
            </View>
          </View>

          <ContinueChart continueListeningData={continueListeningData} />
          <TrendingChart continueListeningData={new_trending || []} title="Trending" type="new_trending" />
          <TrendingChart continueListeningData={top_playlists || []} title="Handpicked Playlists" type="top_playlists" />
          <TrendingChart continueListeningData={new_albums || []} title="New Albums" type="new_albums" />
          <TrendingChart continueListeningData={charts || []} title="Charts" type="charts" />
          {TopArtistData && <TopArtist data={TopArtistData} title="Top Artists" />}

          <View style={{ marginBottom: vs(50) }} />
        </ScrollView>

        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#888"
                value={tempName}
                onChangeText={setTempName}
              />

              <Text style={styles.modalSubtitle}>Select Quality</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowQualityPicker(!showQualityPicker)}>
                <Text style={styles.dropdownText}>
                  {quality === '96' ? 'Low' : quality === '160' ? 'Medium' : 'High'}
                </Text>
              </TouchableOpacity>

              {showQualityPicker && (
                <View style={styles.qualityPicker}>
                  {[
                    { label: 'Low', value: '96' },
                    { label: 'Medium', value: '160' },
                    { label: 'High', value: '320' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.option, quality === option.value && styles.selectedOption]}
                      onPress={() => {
                        setQuality(option.value as '96' | '160' | '320');
                        setShowQualityPicker(false);
                      }}
                    >
                      <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmNameChange} style={styles.confirmButton}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         <LinearGradient
//           colors={[
//             'rgba(14, 14, 14, 0.00)', 
//             'rgba(16, 43, 45, 0.94)', 
//             'rgba(6, 160, 181, 0)',  
//           ]}
//           style={styles.gradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 0, y: 1 }}   
//         />

//         <ScrollView>
//           <View style={styles.header}>
//             <SimpleLineIcons name="music-tone-alt" size={24} color="white" />
//             <Text style={styles.headerText}>
//               Welcome back!{"\n"}
//               {/* <Text style={[styles.headerText, { fontSize: vs(20) }]}>{username}</Text> */}
//               <Text
//               style={[styles.headerText, { fontSize: vs(20) }]}
//               onPress={() => setModalVisible(true)}
//             >
//               {username}
//             </Text>
//             </Text>
             
//             <View style={styles.headerIcons}>
//               <Feather name="bar-chart-2" size={18} color="white" />
//               <Feather name="bell" size={18} color="white" />
//               <Ionicons name="settings-outline" size={18} color="white" />
//             </View>
//           </View>

//           <ContinueChart continueListeningData={continueListeningData} />
//           <TrendingChart continueListeningData={new_trending || []} title="Trending" type="new_trending" />
//           <TrendingChart continueListeningData={top_playlists || []} title="Handpicked Playlists" type="top_playlists" />
//           <TrendingChart continueListeningData={new_albums || []} title="New Albums" type="new_albums" />
//           {/* <TrendingChart continueListeningData={browse_discover || []} title="Discover" type="browse_discover" /> */}
//           <TrendingChart continueListeningData={charts || []} title="Charts" type="charts" />
//           {TopArtistData && <TopArtist data={TopArtistData} title='Top Artists'/>}
//           {/* <TrendingChart continueListeningData={radio || []} title="Radio" type="radio" /> */}

//           <View style={{ marginBottom: vs(50), flex: 1 }} />
//         </ScrollView>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Change Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your name"
//                 placeholderTextColor="#888"
//                 value={tempName}
//                 onChangeText={setTempName}
//               />

//               {/* Quality Selector */}
//               <Text style={styles.modalSubtitle}>Select Quality</Text>
//               <TouchableOpacity
//                 style={styles.dropdown}
//                 onPress={() => setShowQualityPicker(true)}
//               >
//                 <Text style={styles.dropdownText}>{quality}</Text>
//               </TouchableOpacity>

//               {/* Quality Picker */}
//               {showQualityPicker && (
//                 <View style={styles.qualityPicker}>
//                   {['Low', 'Medium', 'High'].map((option) => (
//                     <TouchableOpacity
//                       key={option}
//                       style={[
//                         styles.option,
//                         quality === option && styles.selectedOption,
//                       ]}
//                       onPress={() => {
//                         setQuality(option as 'Low' | 'Medium' | 'High');
//                         setShowQualityPicker(false);
//                       }}
//                     >
//                       <Text style={styles.optionText}>{option}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}

//               {/* Action Buttons */}
//               <View style={styles.buttonRow}>
//                 <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
//                   <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleConfirmNameChange} style={styles.confirmButton}>
//                   <Text style={styles.buttonText}>Confirm</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//         {/* <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Change Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your name"
//                 placeholderTextColor="#888"
//                 value={tempName}
//                 onChangeText={setTempName}
//               />
//               <View style={styles.buttonRow}>
//                 <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
//                   <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleConfirmNameChange} style={styles.confirmButton}>
//                   <Text style={styles.buttonText}>Confirm</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal> */}
//          {/* <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Change Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your name"
//                 placeholderTextColor="#888"
//                 value={tempName}
//                 onChangeText={setTempName}
//               />

//               {/* Quality Picker */}
//               <Text style={styles.modalSubtitle}>Select Quality</Text>
//               <Picker
//                 selectedValue={quality}
//                 onValueChange={(itemValue) => setQuality(itemValue)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Low" value="96" />
//                 <Picker.Item label="Medium" value="160" />
//                 <Picker.Item label="High" value="320" />
//               </Picker>

//               <View style={styles.buttonRow}>
//                 <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
//                   <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleConfirmNameChange} style={styles.confirmButton}>
//                   <Text style={styles.buttonText}>Confirm</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal> */}
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1B1B1B',
//   },
//   gradient: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     height: "30%",
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     margin: vs(10),
//   },
//   headerText: {
//     color: "white",
//     fontFamily: "Montserrat_700Bold",
//     marginLeft: s(10),
//   },
//   headerIcons: {
//     position: 'absolute',
//     right: 0,
//     marginRight: s(5),
//     gap: s(15),
//     flexDirection: 'row',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   modalContent: {
//     backgroundColor: '#222',
//     padding: vs(20),
//     borderRadius: vs(10),
//     width: '80%',
//   },
//   modalTitle: {
//     color: '#fff',
//     fontSize: vs(16),
//     fontFamily: 'Montserrat_700Bold',
//     marginBottom: vs(10),
//   },
//   input: {
//     backgroundColor: '#333',
//     color: '#fff',
//     padding: vs(10),
//     borderRadius: vs(5),
//     marginBottom: vs(10),
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   cancelButton: {
//     padding: vs(10),
//   },
//   confirmButton: {
//     backgroundColor: '#0A84FF',
//     padding: vs(10),
//     borderRadius: vs(5),
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: vs(12),
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '30%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: vs(10),
  },
  headerText: {
    color: 'white',
    fontFamily: 'Montserrat_700Bold',
    marginLeft: s(10),
  },
  headerIcons: {
    position: 'absolute',
    right: 0,
    marginRight: s(5),
    gap: s(15),
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: vs(20),
    borderRadius: vs(10),
    width: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: vs(16),
    fontFamily: 'Montserrat_700Bold',
    marginBottom: vs(10),
  },
  modalSubtitle: {
    color: '#aaa',
    fontSize: vs(14),
    marginBottom: vs(5),
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: vs(10),
    borderRadius: vs(5),
    marginBottom: vs(10),
  },
  picker: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: vs(5),
    marginBottom: vs(10),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: vs(10),
  },
  confirmButton: {
    backgroundColor: '#0A84FF',
    padding: vs(10),
    borderRadius: vs(5),
  },
  buttonText: {
    color: '#fff',
    fontSize: vs(12),
  },
  dropdown: {
    backgroundColor: '#333',
    padding: vs(10),
    borderRadius: vs(5),
    marginBottom: vs(10),
  },
  dropdownText: {
    color: '#fff',
  },
  qualityPicker: {
    backgroundColor: '#444',
    borderRadius: vs(5),
  },
  option: {
    padding: vs(10),
  },
  selectedOption: {
    backgroundColor: '#555',
  },
  optionText: {
    color: '#fff',
  },
});

export default Home;



