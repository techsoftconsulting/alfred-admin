import UserRepository from '@modules/user/domain/repositories/user-repository';
import UserMapper from '@modules/user/infrastructure/mappers/user-mapper';
import AdminUser from '@modules/user/domain/models/admin-user';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'accounts';

export default class ApiUserRepository extends APIRepository implements UserRepository {

    async findAll(): Promise<AdminUser[]> {


        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            }
            /* {
                 field: 'roles',
                 operator: 'array-contains',
                 value: 'ADMIN'
             }*/
        ], undefined, undefined, true);


        return UserMapper.toDomainFromArray(docs);
    }

    async remove(id: string): Promise<void> {
        return this.deleteById(COLLECTION_NAME, id, true);
    }

    async save(user: AdminUser): Promise<void> {
        const dto = UserMapper.toPersistence(user);

        const foundUser = await this.findByEmail(user.email);

        if (!foundUser) {
            const userCredentials = user.toPrimitives().credentials;
            if (!userCredentials) return;
            return this.create(COLLECTION_NAME, { ...dto, credentials: userCredentials }, true);
        }

        if (foundUser.id !== user.id) {
            throw new Error('USER_ALREADY_EXISTS');
        }
        const userCredentials = user.toPrimitives().credentials;
        console.log(userCredentials);
        if (userCredentials) {
            return this.updateById(COLLECTION_NAME, dto.id, { ...dto, credentials: userCredentials }, true);
        }
        return this.updateById(COLLECTION_NAME, dto.id, { ...dto }, true);
    }

    async find(id: string): Promise<AdminUser | null> {
        const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);
        if (!doc) return null;

        return UserMapper.toDomain(doc);
    }

    async findByEmail(email: string): Promise<AdminUser | null> {
        const docs = await this.findByCriteriaRequest(COLLECTION_NAME,
            [
                {
                    field: 'status',
                    operator: '==',
                    value: 'ACTIVE'
                },
                /*   {
                       field: 'roles',
                       operator: 'array-contains',
                       value: 'ADMIN'
                   },*/
                {
                    field: 'email',
                    operator: '==',
                    value: email
                }
            ]
            , undefined, undefined, true);

        if (docs.length == 0) return null;

        return UserMapper.toDomain(docs[0]);
    }
}