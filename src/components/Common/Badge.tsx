import { View, Text } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import { IconName } from '@_types/ui';
import { STATUS_COLORS } from '@_constants';

export const Badge = ({
    label,
    icon,
    bg,
    border,
}: {
    label: string;
    icon?: IconName;
    bg?: string;
    border?: string;
}) => {
    const statusColor = STATUS_COLORS[label];

    // if status color exists and no custom bg/border passed, use status colors
    if (statusColor && !bg && !border) {
        return (
            <View
                style={{ backgroundColor: statusColor.bg, borderColor: statusColor.border }}
                className="flex-row items-center gap-1 rounded-full border px-3 py-1">
                {icon && <Icon name={icon} color={statusColor.text} size={12} />}
                <Text style={{ color: statusColor.text }} className="text-xs font-medium">
                    {label}
                </Text>
            </View>
        );
    }

    return (
        <View
            className={`flex-row items-center gap-1 rounded-full border px-3 py-1 ${bg ?? 'bg-gray-100'} ${border ?? 'border-gray-200'}`}>
            {icon && <Icon name={icon} color="gray" size={12} />}
            <Text className="text-xs text-gray-500">{label}</Text>
        </View>
    );
};
