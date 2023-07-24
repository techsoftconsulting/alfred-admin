import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import UserRoleForm
    from '@modules/user/ui/screens/UserRolesScreen/components/SaveUserRoleModal/components/UserRoleForm';
import useFindUserRole from '@modules/user/application/roles/use-find-user-role';

interface SaveRoleModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string
        defaultValues?: any
    }
}

export default function SaveUserRoleModal(props: SaveRoleModalProps) {
    const { data: role, refetch, loading } = useFindUserRole(props.form?.id ?? '', {
        enabled: !!props.form?.id
    });

    return (
        <Modal
            {...props.modal}
            contentContainerStyle={{
                maxWidth: 500
            }}
        >
            <Box>
                <ModalHeader
                    title={props.form.id ? 'Actualizar rol' : 'Agregar rol'}
                    onClose={props.modal.onDismiss}
                    loading={loading}
                />
                <UserRoleForm
                    id={props.form.id}
                    role={props.form.id ? role : undefined}
                    defaultValues={props.form.defaultValues}
                    onSave={() => {
                        props.modal?.onDismiss?.();
                    }}
                />
            </Box>
        </Modal>
    );
}