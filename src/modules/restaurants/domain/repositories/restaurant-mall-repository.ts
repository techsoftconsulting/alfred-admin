import RestaurantMall from '@modules/restaurants/domain/models/restaurant-mall';

export default interface RestaurantMallRepository {
    save(item: RestaurantMall): Promise<void>;

    remove(id: string): Promise<void>;

    find(id: string): Promise<RestaurantMall | null>;

    findAll(): Promise<RestaurantMall[]>;
}