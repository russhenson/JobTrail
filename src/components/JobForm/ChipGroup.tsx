import { Text, Pressable } from 'react-native';
import { HStack } from '@_components';

type Props = {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    error?: boolean;
};

export const ChipGroup: React.FC<Props> = ({ options, selected, onSelect, error }) => (
    <HStack className="flex-wrap gap-2">
        {options.map(option => {
            const active = selected === option;
            return (
                <Pressable
                    key={option}
                    onPress={() => onSelect(option)}
                    className={`rounded-full border px-4 py-1.5 ${
                        active
                            ? 'border-brand-default bg-brand-default'
                            : error
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200 bg-white'
                    }`}>
                    <Text
                        className={`text-xs font-medium ${
                            active ? 'text-white' : error ? 'text-red-400' : 'text-brand-subtext'
                        }`}>
                        {option}
                    </Text>
                </Pressable>
            );
        })}
    </HStack>
);
