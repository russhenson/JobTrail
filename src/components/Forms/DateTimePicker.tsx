import { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/material-design-icons';
import { useController, Control, FieldValues, Path } from 'react-hook-form';

type FieldProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    placeholder?: string;
    pickerMode?: 'datetime' | 'date';
};

export const DateTimePickerField = <T extends FieldValues>({
    name,
    control,
    placeholder,
    pickerMode,
}: FieldProps<T>) => {
    const { field } = useController({ name, control });

    return (
        <DateTimePicker
            value={field.value ?? ''}
            onChange={field.onChange}
            placeholder={placeholder}
            pickerMode={pickerMode}
        />
    );
};

type Mode = 'date' | 'time';

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    pickerMode?: 'datetime' | 'date';
};

const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (date: Date): string =>
    date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });

const parseOrNow = (value: string): Date => {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const DateTimePicker: React.FC<Props> = ({
    value,
    onChange,
    placeholder = 'Select date',
    pickerMode = 'datetime',
}) => {
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState<Mode>('date');
    const [tempDate, setTempDate] = useState<Date>(parseOrNow(value));

    const displayValue = value
        ? pickerMode === 'date'
            ? formatDate(parseOrNow(value))
            : `${formatDate(parseOrNow(value))}, ${formatTime(parseOrNow(value))}`
        : '';

    const openPicker = () => {
        setMode('date');
        setShow(true);
    };

    const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
        if (event.type === 'dismissed') {
            setShow(false);
            return;
        }

        const current = selected ?? tempDate;

        if (Platform.OS === 'android') {
            setShow(false);

            if (mode === 'date' && pickerMode === 'datetime') {
                // datetime flow: proceed to time
                setTempDate(current);
                setMode('time');
                setShow(true);
            } else {
                // date-only flow: done after date
                setTempDate(current);
                onChange(current.toISOString());
            }
        } else {
            setTempDate(current);
        }
    };

    const handleIOSConfirm = () => {
        if (mode === 'date' && pickerMode === 'datetime') {
            setMode('time');
        } else {
            onChange(tempDate.toISOString());
            setShow(false);
        }
    };

    const handleClear = () => {
        onChange('');
        setTempDate(new Date());
    };

    return (
        <View>
            <Pressable
                onPress={openPicker}
                className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
                <Text className={displayValue ? 'text-sm text-brand-text' : 'text-sm text-gray-400'}>
                    {displayValue || placeholder}
                </Text>
                <View className="flex-row items-center gap-2">
                    {!!value && (
                        <Pressable onPress={handleClear} hitSlop={8}>
                            <Icon name="close-circle-outline" size={16} color="#9ca3af" />
                        </Pressable>
                    )}
                    <Icon name="calendar-clock" size={18} color="#9ca3af" />
                </View>
            </Pressable>

            {show && (
                <View className="mt-2 flex-1 items-center overflow-hidden rounded-xl border border-gray-100 bg-white p-4">
                    <RNDateTimePicker
                        value={tempDate}
                        mode={mode}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onTouchCancel={() => setShow(false)}
                        onChange={handleChange} // still needed for the value
                        minimumDate={new Date(2000, 0, 1)}
                    />

                    {Platform.OS === 'ios' && (
                        <Pressable
                            onPress={handleIOSConfirm}
                            className="mb-3 w-full items-center rounded-xl bg-brand-default py-3">
                            <Text className="text-sm font-medium text-white">
                                {mode === 'date' && pickerMode === 'datetime' ? 'Next: Pick Time' : 'Confirm'}
                            </Text>
                        </Pressable>
                    )}
                </View>
            )}
        </View>
    );
};
