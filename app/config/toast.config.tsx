import{ BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      text2NumberOfLines={10}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text2NumberOfLines={10}
    />
  ),
};