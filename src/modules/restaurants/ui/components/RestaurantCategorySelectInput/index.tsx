import { SelectInputProps } from '@main-components/Form/inputs/SelectInput';
import useFindRestaurantCategories from '@modules/restaurants/application/categories/use-find-restaurant-categories';
import SelectArrayInput from '@main-components/Form/inputs/SelectArrayInput';

interface RestaurantCategorySelectInputProps extends Omit<SelectInputProps, 'choices'> {
    type?: string;
}

export default function RestaurantCategorySelectInput(props: RestaurantCategorySelectInputProps) {
    const { data, loading } = useFindRestaurantCategories({
        type: props.type
    }, {
        enabled: !!props.type
    });

    return (
            <SelectArrayInput
                    {...props}
                    choices={data?.map(e => {
                        return {
                            id: e.id,
                            label: e.name,
                            name: e.name
                        };
                    })}
            />
    );
}