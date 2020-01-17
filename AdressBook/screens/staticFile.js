import { Dimensions } from 'react-native';

export class UIConstants {
    static vw = (Dimensions.get('window').width - 20) / 375;
    static vh = Dimensions.get('window').height / 667;
}