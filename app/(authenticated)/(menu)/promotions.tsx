import PromotionsScreen from '@modules/promotions/ui/screens/PromotionsScreen';
import ProtectedRoute from '@main-components/Base/ProtectedRoute';

export default function PromotionsRoute() {
    return (
            <ProtectedRoute route={'LIST_PROMOTIONS'}>
                <PromotionsScreen />
            </ProtectedRoute>
    );
}