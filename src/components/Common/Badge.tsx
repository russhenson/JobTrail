import { View, Text } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import { IconName } from '@_types/ui';

export const Badge = ({
    label,
    icon,
    bg = 'bg-gray-100',
    border = 'border-gray-200',
}: {
    label: string;
    icon?: IconName;
    bg?: string;
    border?: string;
}) => {
    return (
        <View key={label} className={`flex-row items-center gap-1 rounded-full border px-3 py-1 ${bg} ${border}`}>
            {icon && <Icon name={icon} color='gray' />}
            <Text className="text-xs text-gray-500">{label}</Text>
        </View>
    );
};
