import ObjectUtils from '@utils/misc/object-utils';
import AdminUser from '@modules/user/domain/models/admin-user';

export default class UserMapper {

    static toDomain(dto: any): AdminUser {
        return AdminUser.fromPrimitives({
            id: dto.id,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            status: dto.status,
            role: dto.roleId
        });
    }

    static toDomainFromArray(dtos: any[]): AdminUser[] {
        return dtos.map(dto => UserMapper.toDomain(dto));
    }

    static toPersistenceFromArray(users: AdminUser[]): AdminUser[] {
        return users.map(m => UserMapper.toPersistence(m));
    }

    static toPersistence(user: AdminUser): any {
        const dto = user.toPrimitives();

        return ObjectUtils.omitUnknown({
            id: dto.id,
            email: dto.email.toLowerCase(),
            status: dto.status,
            firstName: dto.firstName,
            lastName: dto.lastName,
            roleId: dto.role,
            roles: ['ADMIN']
        });
    }

}