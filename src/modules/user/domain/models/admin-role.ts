interface AdminRoleProps {
    id: string;
    name: string,
    permissions: string[];
    status: string;
}

export interface AdminRolePrimitiveProps extends AdminRoleProps {

}

export default class AdminRole {
    constructor(private props: AdminRoleProps) {

    }

    get id() {
        return this.props.id;
    }

    get name() {
        return this.props.name;
    }

    get permissions() {
        if (!!this.props.permissions?.find(el => el == 'LIST_USERS_AND_ROLES')) {
            return [
                ...this.props.permissions,
                ...[
                    'LIST_USERS',
                    'LIST_ROLES'
                ]
            ];
        }
        return this.props.permissions;
    }

    static fromPrimitives(props: AdminRolePrimitiveProps) {
        return new AdminRole({
            ...props
        });
    }

    toPrimitives(): AdminRolePrimitiveProps {
        return {
            ...this.props
        };
    }
}
