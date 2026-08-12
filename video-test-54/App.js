import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { VideoView, useVideoPlayer } from "expo-video";
import { useRef, useState, useEffect } from "react";
import { View, Button } from "react-native";

export default function App() {
  const cameraRef = useRef(null);
  const [videoUri, setVideoUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
  const player = useVideoPlayer(null);

  useEffect(() => {
    if (videoUri) {
      player.replace(videoUri);
      player.play();
    }
  }, [videoUri]);

  if (!cameraPermission || !audioPermission) {
    return <View />;
  }

  if (!cameraPermission.granted || !audioPermission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}>
        <Button title="Grant Camera Permission" onPress={requestCameraPermission} />
        <View style={{ height: 20 }} />
        <Button title="Grant Microphone Permission" onPress={requestAudioPermission} />
      </View>
    );
  }

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;
    try {
      setIsRecording(true);
      const result = await cameraRef.current.recordAsync({ maxDuration: 30 });
      if (result?.uri) setVideoUri(result.uri);
    } catch (error) {
      console.log("Recording Error:", error);
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!cameraRef.current || !isRecording) return;
    cameraRef.current.stopRecording();
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        facing="back"
        style={{ flex: 1 }}
        mode="video"
      />
      <Button
        title={isRecording ? "Recording..." : "Start Recording"}
        onPress={startRecording}
        disabled={isRecording}
      />
      <View style={{ height: 10 }} />
      <Button
        title="Stop Recording"
        onPress={stopRecording}
        disabled={!isRecording}
      />
      {videoUri && (
        <VideoView
          player={player}
          style={{ width: "100%", height: 300, marginTop: 10 }}
          nativeControls
          allowsFullscreen
        />
      )}
    </View>
  );
}
