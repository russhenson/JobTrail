import { View, Text } from 'react-native';

type Props = { label: string };

export const SectionLabel: React.FC<Props> = ({ label }) => (
    <View className="mb-3 mt-5 border-b border-gray-100 pb-1">
        <Text className="text-brand-gray text-xs font-semibold uppercase tracking-widest">{label}</Text>
    </View>
);
