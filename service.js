import TrackPlayer , {Event} from 'react-native-track-player';


module.exports = async function () {

  try {
    TrackPlayer.addEventListener('remote-play', () => {
      TrackPlayer.play()
    })

    TrackPlayer.addEventListener('remote-pause', () => {
      TrackPlayer.pause()
    });

    TrackPlayer.addEventListener('remote-next', () => {
      TrackPlayer.skipToNext()
    });

    TrackPlayer.addEventListener('remote-previous', () => {
      TrackPlayer.skipToPrevious()
    });

    TrackPlayer.addEventListener('remote-stop', () => {
      TrackPlayer.destroy()
    });
    TrackPlayer.addEventListener('remote-seek', (event) => {
      const position = event.position;
      TrackPlayer.seekTo(position);
    });
    

    
  } catch (error) { }

};