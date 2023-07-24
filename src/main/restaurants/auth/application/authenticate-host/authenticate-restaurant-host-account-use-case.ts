import AuthTokenCreator from '@shared/domain/authentication/auth-token-creator';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import RestaurantAccountsRepository from '@restaurants/auth/domain/repositories/restaurant-accounts-repository';
import Criteria from '@shared/domain/criteria/criteria';
import Filters from '@shared/domain/criteria/filters';

@service()
export default class AuthenticateRestaurantHostAccountUseCase {
  constructor(
    @inject('RestaurantAccountsRepository')
    private userFinder: RestaurantAccountsRepository,
    @inject('user.authentication.token.creator')
    private tokenCreator: AuthTokenCreator<any>,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {}

  public async execute(credentials: {
    email: string;
    password: string;
  }): Promise<string | null> {
    const authUser: any = await this.ensureUserExists(credentials.email);

    await this.ensureCredentialsAreValid(authUser, credentials);

    const tokenData = {
      email: authUser.email,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      roles: authUser.roles,
      id: authUser.id,
      userType: 'RESTAURANT-HOST',
      metadata: {
        restaurantId: authUser.restaurantId,
        type: authUser.type,
      },
    };

    const token = await this.tokenCreator.generate(tokenData);

    return token;
  }

  private async ensureUserExists(email: string): Promise<any> {
    const users = await this.userFinder.findAll(
      new Criteria({
        order: undefined,
        filters: Filters.fromArray([
          {
            field: 'email',
            operator: '==',
            value: email,
          },
          {
            field: 'status',
            operator: '==',
            value: 'ACTIVE',
          },
          {
            field: 'type',
            operator: '==',
            value: 'HOST',
          },
        ]),
      }),
    );

    const user = users.length == 0 ? undefined : users[0];

    if (!user) {
      throw new Error('user_not_found');
    }

    return user;
  }

  private async ensureCredentialsAreValid(
    authUser: any,
    credentials: { email: string; password: string },
  ) {
    const result = await this.passwordHasher.comparePassword(
      credentials.password ?? '',
      authUser.password ?? '',
    );

    if (!result) {
      throw new Error('invalid_credentials');
    }

    return result;
  }
}
