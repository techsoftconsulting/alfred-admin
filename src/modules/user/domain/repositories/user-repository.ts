import AdminUser from '@modules/user/domain/models/admin-user';

export default interface UserRepository {
    save(user: AdminUser): Promise<void>;

    remove(id: string): Promise<void>;

    find(id: string): Promise<AdminUser | null>;

    findByEmail(email: string): Promise<AdminUser | null>;

    findAll(): Promise<AdminUser[]>;
}