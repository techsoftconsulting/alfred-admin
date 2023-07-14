import AccountSettingsScreen from '@modules/user/ui/screens/AccountSettingsScreen';
import ProtectedRoute from '@main-components/Base/ProtectedRoute';

export default function Account() {
    return (
            <ProtectedRoute route={'ACCOUNT'}>
                <AccountSettingsScreen />
            </ProtectedRoute>
    );
}