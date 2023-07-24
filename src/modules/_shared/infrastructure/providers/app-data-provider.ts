import ApiAuthUserRepository from '@modules/auth/infrastructure/repositories/api-auth-user-repository';
import ApiPromotionRepository from '@modules/promotions/infrastructure/repositories/api-promotion-repository';
import ApiRestaurantCategoryRepository
    from '@modules/restaurants/infrastructure/repositories/api-restaurant-category-repository';
import ApiRestaurantMallRepository
    from '@modules/restaurants/infrastructure/repositories/api-restaurant-mall-repository';
import ApiRestaurantManagerRepository
    from '@modules/restaurants/infrastructure/repositories/api-restaurant-manager-repository';
import ApiRestaurantRepository from '@modules/restaurants/infrastructure/repositories/api-restaurant-repository';
import ApiUserRepository from '@modules/user/infrastructure/repositories/api-user-repository';
import ApiUserRoleRepository from '@modules/user/infrastructure/repositories/api-user-role-repository';
import ApiStatsRepository from '@modules/user/infrastructure/repositories/api-stats-repository';

const AppDataProvider = (userTokenId?: string) => {

    const defaultProps = {
        tokenId: userTokenId
    };

    return {
        AuthUserRepository: new ApiAuthUserRepository(defaultProps),
        RestaurantRepository: new ApiRestaurantRepository(defaultProps),
        RestaurantCategoryRepository: new ApiRestaurantCategoryRepository(defaultProps),
        RestaurantMallRepository: new ApiRestaurantMallRepository(defaultProps),
        RestaurantManagerRepository: new ApiRestaurantManagerRepository(defaultProps),
        UserRepository: new ApiUserRepository(defaultProps),
        UserRoleRepository: new ApiUserRoleRepository(defaultProps),
        PromotionRepository: new ApiPromotionRepository(defaultProps),
        StatsRepository: new ApiStatsRepository(defaultProps)
    };
};

export default AppDataProvider;
