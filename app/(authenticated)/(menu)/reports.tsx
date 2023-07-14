import StatsScreen from '@modules/user/ui/screens/StatsScreen';
import ProtectedRoute from '@main-components/Base/ProtectedRoute';

export default function ReportsRoute() {

    return (
            <ProtectedRoute route={'SEE_STATS'}>
                <StatsScreen />
            </ProtectedRoute>
    );
}