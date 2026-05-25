import './global.css';
import RootNavigator from '@_navigation/RootNavigator';
import { useNotificationPermission } from '@_hooks/useNotificationPermission';

export default function App() {
    useNotificationPermission();
    
    return <RootNavigator />;
}
