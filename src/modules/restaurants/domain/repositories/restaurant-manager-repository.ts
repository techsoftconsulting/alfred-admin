import RestaurantManager from '@modules/restaurants/domain/models/restaurant-manager';

export default interface RestaurantManagerRepository {
    save(manager: RestaurantManager): Promise<void>;

    remove(id: string): Promise<void>;

    find(id: string): Promise<RestaurantManager | null>;

    findByEmail(email: string, type: string): Promise<RestaurantManager | null>;

    findAll(restaurantId: string): Promise<RestaurantManager[]>;
}