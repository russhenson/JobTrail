import { Text } from 'react-native';
import { HStack } from '@_components';

type Props = { label: string; required?: boolean; optional?: boolean };

export const FieldLabel: React.FC<Props> = ({ label, required, optional }) => (
    <HStack className="mb-1.5 items-center gap-1">
        <Text className="text-sm font-medium text-brand-text">{label}</Text>
        {required && <Text className="text-xs text-red-400">*</Text>}
        {optional && <Text className="text-brand-gray text-xs">(optional)</Text>}
    </HStack>
);
