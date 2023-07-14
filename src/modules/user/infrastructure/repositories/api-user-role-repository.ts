import APIRepository from '@shared/infrastructure/api/api-repository';
import UserRoleRepository from '@modules/user/domain/repositories/user-role-repository';
import AdminRole from '@modules/user/domain/models/admin-role';
import ObjectUtils from '@utils/misc/object-utils';

const COLLECTION_NAME = 'admin-roles';

export default class ApiUserRoleRepository extends APIRepository implements UserRoleRepository {

    async findAll(): Promise<AdminRole[]> {

        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            }
        ], undefined, undefined, true);


        return docs.map((doc) => {
            return AdminRole.fromPrimitives({
                id: doc.id,
                name: doc.name,
                permissions: doc.permissions,
                status: doc.status
            });
        });
    }

    async remove(id: string): Promise<void> {
        return this.deleteById(COLLECTION_NAME, id, true);
    }

    async save(role: AdminRole): Promise<void> {
        return this.create(COLLECTION_NAME, ObjectUtils.omitUnknown(role.toPrimitives()), true);
    }

    async find(id: string): Promise<AdminRole | null> {
        const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);
        if (!doc) return null;

        return AdminRole.fromPrimitives({
            id: doc.id,
            name: doc.name,
            permissions: doc.permissions,
            status: doc.status
        });
    }
}