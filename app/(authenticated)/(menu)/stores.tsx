import RestaurantsScreen from '@modules/restaurants/ui/screens/RestaurantsScreen';
import ProtectedRoute from '@main-components/Base/ProtectedRoute';

export default function StoreRoute() {
    return (
            <ProtectedRoute route={'LIST_STORES'}>
                <RestaurantsScreen />
            </ProtectedRoute>
    );
}