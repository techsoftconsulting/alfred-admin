import UsersScreen from '@modules/user/ui/screens/UsersScreen';
import ProtectedRoute from '@main-components/Base/ProtectedRoute';

export default function UsersRoute() {
    return (
            <ProtectedRoute route={'LIST_USERS'}>
                <UsersScreen />
            </ProtectedRoute>
    );

}