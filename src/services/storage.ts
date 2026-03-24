import AsyncStorage from '@react-native-async-storage/async-storage';

const WII_IP_KEY = '@wii_ip';

export async function getWiiIp(): Promise<string | null> {
  return AsyncStorage.getItem(WII_IP_KEY);
}

export async function setWiiIp(ip: string): Promise<void> {
  return AsyncStorage.setItem(WII_IP_KEY, ip);
}
