import { required } from '@shared/domain/form/validate';
import ImageCropperInput from '@main-components/Form/inputs/ImageCropperInput';

export function MallLogoInput(props) {
    const PREVIEW_IMAGE_SIZE = 150;
    const PREVIEW_IMAGE_HEIGHT = 150;
    return (
        <ImageCropperInput
            {...props}
            source={'logoUrl'}
            validate={[required()/* (value) => {
                if (value && !value.isCropped) {
                    return 'Por favor aplica el recorte de la imagen';
                }
                return;
            }*/]}
            label={'Logo'}
            required
            cropSize={{
                width: 250,
                height: 250
            }}
            previewSize={{
                width: PREVIEW_IMAGE_SIZE,
                height: PREVIEW_IMAGE_HEIGHT
            }}
        />
    );
}