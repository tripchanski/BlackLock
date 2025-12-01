import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from '../navigation/types';

export function useAppNavigation() {
  return useNavigation<AppNavigationProp>();
}
