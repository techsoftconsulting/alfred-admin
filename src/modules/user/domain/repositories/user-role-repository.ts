import AdminRole from '@modules/user/domain/models/admin-role';

export default interface UserRoleRepository {
    save(role: AdminRole): Promise<void>;

    remove(id: string): Promise<void>;

    find(id: string): Promise<AdminRole | null>;

    findAll(): Promise<AdminRole[]>;
}