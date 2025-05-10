import App from '../App';
import { BottomTab } from '../navigation/MainNavigator';

export default function RootLayout() {  
    return (
      <>
        <App>
            <BottomTab />
        </App>
      </>
    );
}
