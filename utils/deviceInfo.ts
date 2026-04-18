import * as Device from 'expo-device';

export const getDeviceInfo = () => {
  return {
    brand: Device.brand,
    manufacturer: Device.manufacturer,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    deviceType: Device.deviceType,
    isDevice: Device.isDevice,
  };
};