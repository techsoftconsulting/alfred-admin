import UserRolesScreen from '@modules/user/ui/screens/UserRolesScreen';
import ProtectedRoute from '@main-components/Base/ProtectedRoute';

export default function UserRolesRoute() {
    return (
            <ProtectedRoute route={'LIST_ROLES'}>
                <UserRolesScreen />
            </ProtectedRoute>
    );
}