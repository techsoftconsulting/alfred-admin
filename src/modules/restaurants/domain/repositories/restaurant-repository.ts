import Restaurant from '@modules/restaurants/domain/models/restaurant';

export default interface RestaurantRepository {
    save(restaurant: Restaurant): Promise<void>;

    remove(id: string): Promise<void>;

    find(id: string): Promise<Restaurant | null>;

    guardUniqueSlug(slug: string, id: string): Promise<any>;

    findAll(filters?: any): Promise<Restaurant[]>;
}