import CategoriesScreen from '@modules/restaurants/ui/screens/CategoriesScreen';
import ProtectedRoute from '@main-components/Base/ProtectedRoute';

export default function CategoriesRoute() {
    return (
            <ProtectedRoute route={'LIST_CATEGORIES'}>
                <CategoriesScreen />
            </ProtectedRoute>
    );
}