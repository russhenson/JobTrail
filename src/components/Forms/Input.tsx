import { Controller, Control, FieldErrors, FieldError, FieldValues, Path } from 'react-hook-form';
import { TextInput, Keyboard, Text, Pressable } from 'react-native';
import { VStack } from '@_components';
import { useState } from 'react';
import Icon from '@react-native-vector-icons/material-design-icons';
import { formatName } from '@_utils';
import { IconName } from '@_types/ui';

interface InputProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    errors: FieldErrors<T>;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    pattern?: RegExp;
    maxLength?: number;
    minLength?: number;
    rightIconName?: IconName;
    onIconPress?: () => void;
    secureTextEntry?: boolean;
    validate?: (value: any, formValues?: any) => string | boolean;
}

export const Input = <T extends FieldValues>({
    name,
    control,
    errors,
    label,
    placeholder,
    required,
    pattern = /.*/,
    disabled,
    maxLength = 200,
    minLength,
    rightIconName,
    onIconPress,
    secureTextEntry,
    validate,
}: InputProps<T>) => {
    const error = errors[name] as FieldError | undefined;

    const [isFocused, setIsFocused] = useState(false);

    const getTextColor = () => {
        if (error?.message) return 'text-red-500';
        if (disabled) return 'text-gray-500';
        if (isFocused) return 'text-brand-default';
        return 'text-gray-500';
    };

    const getBorderColor = () => {
        if (error?.message) return 'border-red-500';
        if (isFocused) return 'border-brand-default';
        return 'border-gray-300';
    };

    const textColor = getTextColor();
    const borderColor = getBorderColor();

    return (
        <VStack>
            {label && <Text className={`${textColor}`}>{label}</Text>}
            <Controller
                control={control}
                name={name}
                rules={{
                    required: required && `${label || formatName(String(name))} is required.`,
                    maxLength: {
                        value: maxLength,
                        message: `${label || formatName(String(name))} should not exceed ${maxLength} characters.`,
                    },
                    minLength: {
                        value: minLength || 1,
                        message: `${label || formatName(String(name))} should be at least ${minLength} characters`,
                    },
                    pattern: {
                        value: formatName(String(name)) === 'email' ? /^\S+@\S+\.\S+$/ : pattern,
                        message: `Please enter a valid ${label || formatName(String(name))}.`,
                    },
                    validate: value => {
                        // Prevent inputs that are only whitespace
                        if (typeof value === 'string' && /^\s+$/.test(value)) {
                            return `Invalid ${label || formatName(String(name))}.`;
                        }
                        if (validate) {
                            return validate(value);
                        }

                        return true;
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <VStack className="relative">
                        <TextInput
                            className={`rounded-2xl border ${borderColor} placeholder:text-brand-gray px-4 py-3`}
                            placeholder={placeholder}
                            value={value ?? ''}
                            editable={!disabled}
                            secureTextEntry={secureTextEntry}
                            onChangeText={onChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                        {rightIconName && (
                            <Pressable
                                onPress={onIconPress}
                                className="active:opacity-50"
                                style={{
                                    zIndex: 10,
                                    position: 'absolute',
                                    top: '50%',
                                    right: 14,
                                    transform: [{ translateY: -22 / 2 }],
                                }}>
                                <Icon name={rightIconName} size={22} color="#bbb" />
                            </Pressable>
                        )}
                    </VStack>
                )}
            />

            {error?.message && <Text className="mt-1 text-sm text-red-500">{error.message}</Text>}
        </VStack>
    );
};
