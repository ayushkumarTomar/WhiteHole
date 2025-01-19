import { Montserrat_500Medium, Montserrat_600SemiBold, useFonts } from "@expo-google-fonts/montserrat";
import { View, Text, StyleSheet, Modal, TouchableOpacity} from "react-native";
import { vs } from "react-native-size-matters";
import Loading from "./loading";
import { Raleway_500Medium } from "@expo-google-fonts/raleway";


interface ContextMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onPlayNext?: () => void;
  onAddQueue?: () => void;
  onPlaylist?: () => void;
  shorterContextMenu?: boolean;
  deleteSong?:boolean;
  deleteSongFunc?:()=>void;
  // children?: React.ReactNode;


}
const ContextMenu: React.FC<ContextMenuProps> = ({ isVisible, onClose , onPlayNext , onAddQueue , onPlaylist , shorterContextMenu , deleteSong , deleteSongFunc}) => {

    const [fontsLoaded] = useFonts({
        Montserrat_600SemiBold,
        Montserrat_500Medium,
        Raleway_500Medium
      });
      if (!fontsLoaded) return <Loading />;
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade" 
      onRequestClose={onClose} 
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose} 
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalBody}>                
              {!shorterContextMenu && <Text style={styles.modalContentText}
              onPress= {onPlayNext} 
              >Play Next</Text>}
              {!shorterContextMenu && <Text style={styles.modalContentText}
              onPress={onAddQueue}
              >Add to Queue</Text>}
              {!deleteSong && <Text style={styles.modalContentText}
              onPress={onPlaylist}
              >Add to Playlist</Text>}
              {deleteSong && <Text style={styles.modalContentText}
              onPress={deleteSongFunc}
                >Remove from Playlist
              </Text>  }


            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: "transparent",
    borderRadius: vs(10),
    overflow: "hidden",
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  modalBody: {
    marginBottom: vs(15),
    alignItems: "center",
  },
  modalContentText: {
      fontFamily: "Raleway_500Medium",
      fontSize: vs(13),
      marginTop: vs(7),
      justifyContent:'space-between' ,
      color: 'white',
      padding: vs(6),

    }
  });
  
  export default ContextMenu;
  