import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

export const useCameraPermission = () => {
  const [granted, setGranted] = useState<boolean | null>(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const allowed = status === "granted";
    setGranted(allowed);
    return allowed;
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return {
    granted,
    requestPermission,
  };
};
