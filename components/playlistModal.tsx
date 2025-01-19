import { Montserrat_500Medium, Montserrat_600SemiBold, useFonts } from "@expo-google-fonts/montserrat";
import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { ms, vs } from "react-native-size-matters";
import Loading from "./loading";
import { Raleway_500Medium } from "@expo-google-fonts/raleway";
import { LinearGradient } from "expo-linear-gradient";

interface PlayListModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreatePlaylist: (playlistName: string) => void; 
}

const PlayListModal: React.FC<PlayListModalProps> = ({ isVisible, onClose, onCreatePlaylist }) => {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_500Medium,
    Raleway_500Medium,
  });
  const [playlistName, setPlaylistName] = useState(""); 

  if (!fontsLoaded) return <Loading />;

  const handleCreatePlaylist = () => {
    if (playlistName.trim() !== "") {
      onCreatePlaylist(playlistName); 
      setPlaylistName(""); 
      onClose(); 
    } else {
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Create New Playlist</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter playlist name"
                value={playlistName}
                onChangeText={setPlaylistName}
                placeholderTextColor="#888"
              />

              <TouchableOpacity onPress={handleCreatePlaylist}>
              <LinearGradient
                  colors={["#0A84FF", "#4C9BFF"]} 
                  style={styles.createButton} 
                >
                <Text style={styles.createButtonText}>Create Playlist</Text>
                </LinearGradient>

              </TouchableOpacity>
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
    padding: vs(20),
    alignItems: "center",
    backgroundColor: "#1B1B1B",
    borderRadius: vs(10),
  },
  modalBody: {
    marginBottom: vs(15),
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: vs(10),
    marginBottom: vs(10),
    color: "white",
  },
  input: {
    width: ms(200),
    height: vs(30),
    backgroundColor: "#333",
    color: "white",
    borderRadius: vs(5),
    paddingLeft: vs(10),
    marginBottom: vs(20),
    fontFamily: "Raleway_500Medium",
    fontSize: vs(8),
  },
  createButton: {
    // backgroundColor: "#0A84FF",
    borderRadius: vs(5),
    paddingVertical: vs(7),
    paddingHorizontal: vs(12),
  },
  createButtonText: {
    color: "white",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: vs(8),
  },
});

export default PlayListModal;
