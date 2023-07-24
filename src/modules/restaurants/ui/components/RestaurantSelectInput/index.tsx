import SelectInput, { SelectInputProps } from '@main-components/Form/inputs/SelectInput';
import useFindRestaurants from '@modules/restaurants/application/use-find-restaurants';

interface RestaurantSelectInputProps extends Omit<SelectInputProps, 'choices'> {

}

export default function RestaurantSelectInput(props: RestaurantSelectInputProps) {
    const { data, loading } = useFindRestaurants({});

    return (
            <SelectInput
                    {...props}
                    choices={data?.map(e => {
                        return {
                            id: `${e.id}`,
                            label: e.name,
                            name: e.name
                        };
                    })}
            />
    );
}