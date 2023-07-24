import MallsScreen from '@modules/restaurants/ui/screens/MallsScreen';
import ProtectedRoute from '@main-components/Base/ProtectedRoute';

export default function MallsRoute() {
    return (
            <ProtectedRoute route={'LIST_MALLS'}>
                <MallsScreen />
            </ProtectedRoute>
    );
}