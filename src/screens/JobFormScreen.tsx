import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import {
    VStack,
    Button,
    ScreenContainer,
    Input,
    AlertMessage,
    ChipGroup,
    FieldLabel,
    SectionLabel,
    DateTimePickerField,
} from '@_components';
import { useForm, useWatch } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { Job } from '@_types/navigation';
import { JOB_STATUSES, JOB_TYPES, JOB_SETUPS } from '@_constants';
import Icon from '@react-native-vector-icons/material-design-icons';
import { scheduleInterviewNotifications, cancelInterviewNotifications, api } from '@_utils';
import dayjs from 'dayjs';

type Props = NativeStackScreenProps<RootStackParamList, 'Form'>;

export const JobFormScreen: React.FC<Props> = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const params = route.params;
    const jobId = params?.id;
    const job = params?.job;
    const isEdit = !!jobId;

    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<Job>({
        defaultValues: {
            company: job?.company || '',
            role: job?.role || '',
            location: job?.location || '',
            dateApplied: job?.dateApplied || '',
            salary: job?.salary || '',
            applicationLink: job?.applicationLink || '',
            interviewDatetime: job?.interviewDatetime || '',
            interviewLink: job?.interviewLink || '',
            notes: job?.notes || '',
            recruiterName: job?.recruiterName || '',
            recruiterContact: job?.recruiterContact || '',
        },
    });

    const [status, setStatus] = useState(job?.status ?? '');
    const [jobType, setJobType] = useState(job?.jobType ?? '');
    const [jobSetup, setJobSetup] = useState(job?.jobSetup ?? '');

    const [statusError, setStatusError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const [setupError, setSetupError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const interviewDatetime = useWatch({ control, name: 'interviewDatetime' });

    const onPress = () => {
        const hasStatusError = !status;
        const hasTypeError = !jobType;
        const hasSetupError = !jobSetup;

        setStatusError(hasStatusError);
        setTypeError(hasTypeError);
        setSetupError(hasSetupError);

        handleSubmit(onSubmit)();
    };

    const onSubmit = async (data: Job) => {
        if (!status || !jobType || !jobSetup) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        setErrorMessage(null);

        const payload = {
            company: data.company,
            role: data.role,
            location: data.location,
            dateApplied: data.dateApplied,
            status,
            jobType,
            jobSetup,
            salary: data.salary || null,
            applicationLink: data.applicationLink || null,
            interviewDatetime: data.interviewDatetime || null,
            interviewLink: data.interviewLink || null,
            recruiterName: data.recruiterName || null,
            recruiterContact: data.recruiterContact || null,
            notes: data.notes || null,
        };

        try {
            setLoading(true);

            if (isEdit) {
                await api.put(`/jobs/${jobId}`, payload);

                // sync - cancel old notifications and reschedule if interview changed
                if (payload.interviewDatetime) {
                    await cancelInterviewNotifications(jobId);
                    await scheduleInterviewNotifications({
                        id: jobId,
                        role: payload.role,
                        company: payload.company,
                        interviewDatetime: payload.interviewDatetime,
                    });
                }
            } else {
                const res = await api.post('/jobs', payload);
                const newJobId = res.data._id;

                if (payload.interviewDatetime && dayjs(payload.interviewDatetime).isAfter(dayjs())) {
                    await scheduleInterviewNotifications({
                        id: newJobId,
                        role: payload.role,
                        company: payload.company,
                        interviewDatetime: payload.interviewDatetime,
                    });
                }
            }

            await queryClient.invalidateQueries({ queryKey: ['jobs'] });
            await queryClient.invalidateQueries({ queryKey: ['jobs-dashboard'] });

            navigation.goBack();
        } catch (err: any) {
            console.error('SAVE JOB ERROR:', err.response?.data || err.message);
            setErrorMessage(err.response?.data?.error || 'Failed to save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onDelete = () => {
        Alert.alert('Delete Application', `Remove ${job?.role} at ${job?.company}? This can't be undone.`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setDeleting(true);
                        await api.delete(`/jobs/${jobId}`);
                        await cancelInterviewNotifications(jobId!);
                        await queryClient.invalidateQueries({ queryKey: ['jobs'] });
                        await queryClient.invalidateQueries({ queryKey: ['jobs-dashboard'] });
                        navigation.goBack();
                    } catch (err: any) {
                        console.error('DELETE JOB ERROR:', err.response?.data || err.message);
                        setErrorMessage(err.response?.data?.error || 'Failed to delete. Please try again.');
                    } finally {
                        setDeleting(false);
                    }
                },
            },
        ]);
    };

    return (
        <ScreenContainer noPadding keyboardAvoid scrollable>
            <VStack className="flex-1">
                {/* Header */}
                <View className="justify-center bg-brand-default px-6 pb-6" style={{ paddingTop: insets.top + 30 }}>
                    {/* Back button — absolute left */}
                    <Pressable
                        onPress={() => navigation.goBack()}
                        className="absolute left-4 top-0 z-10 p-2 active:opacity-60"
                        style={{ paddingTop: insets.top + 10 }}>
                        <Icon name="arrow-left" size={22} color="white" />
                    </Pressable>

                    {/* Centered text */}
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-white">
                            {isEdit ? 'Fixing Your Lies' : 'Adding to the Pile'}
                        </Text>
                        <Text className="mt-1 text-sm text-white/70">
                            {isEdit
                                ? 'Something changed? Or you just finally read the job post.'
                                : "Spray and pray. We don't judge."}
                        </Text>
                    </View>
                </View>

                <VStack className="p-4">
                    {/* Job Info */}
                    <SectionLabel label="Job Info" />
                    <VStack className="gap-4">
                        <View>
                            <FieldLabel label="Company" required />
                            <Input
                                name="company"
                                control={control}
                                errors={errors}
                                placeholder="e.g. Google, Meta, Your Dream Co."
                                required
                            />
                        </View>
                        <View>
                            <FieldLabel label="Role" required />
                            <Input
                                name="role"
                                control={control}
                                errors={errors}
                                placeholder="e.g. Senior Product Designer"
                                required
                            />
                        </View>
                        <View>
                            <FieldLabel label="Location" required />
                            <Input
                                name="location"
                                control={control}
                                errors={errors}
                                placeholder="e.g. Manila, PH"
                                required
                            />
                        </View>
                        <View>
                            <FieldLabel label="Date Applied" required />
                            <DateTimePickerField
                                name="dateApplied"
                                control={control}
                                placeholder="Select date applied"
                                pickerMode="date"
                            />
                        </View>
                    </VStack>

                    {/* Status */}
                    <SectionLabel label="Status" />
                    <View>
                        <FieldLabel label="Current Status" required />
                        <ChipGroup
                            options={JOB_STATUSES}
                            selected={status}
                            onSelect={val => {
                                setStatus(val);
                                setStatusError(false);
                            }}
                            error={statusError}
                        />
                        {statusError && <Text className="mt-1 text-xs text-red-400">Please select a status.</Text>}
                    </View>

                    {/* Work Arrangement */}
                    <SectionLabel label="Work Arrangement" />
                    <VStack className="gap-4">
                        <View>
                            <FieldLabel label="Job Type" required />
                            <ChipGroup
                                options={JOB_TYPES}
                                selected={jobType}
                                onSelect={val => {
                                    setJobType(val);
                                    setTypeError(false);
                                }}
                                error={typeError}
                            />
                            {typeError && <Text className="mt-1 text-xs text-red-400">Please select a job type.</Text>}
                        </View>
                        <View>
                            <FieldLabel label="Setup" required />
                            <ChipGroup
                                options={JOB_SETUPS}
                                selected={jobSetup}
                                onSelect={val => {
                                    setJobSetup(val);
                                    setSetupError(false);
                                }}
                                error={setupError}
                            />
                            {setupError && <Text className="mt-1 text-xs text-red-400">Please select a setup.</Text>}
                        </View>
                    </VStack>

                    {/* Optional Details */}
                    <SectionLabel label="Optional Details" />
                    <VStack className="gap-4">
                        <View>
                            <FieldLabel label="Salary" optional />
                            <Input
                                name="salary"
                                control={control}
                                errors={errors}
                                placeholder="e.g. ₱80,000 - ₱120,000 / mo"
                            />
                        </View>
                        <View>
                            <FieldLabel label="Application Link" optional />
                            <Input
                                name="applicationLink"
                                control={control}
                                errors={errors}
                                placeholder="e.g. https://jobs.google.com/..."
                            />
                        </View>
                    </VStack>

                    {/* Interview */}
                    <SectionLabel label="Interview" />
                    <VStack className="gap-4">
                        <View>
                            <FieldLabel label="Interview Date & Time" optional />
                            <DateTimePickerField
                                name="interviewDatetime"
                                control={control}
                                placeholder="Select interview date & time"
                                pickerMode="datetime"
                            />
                        </View>
                        {!!interviewDatetime && (
                            <View>
                                <FieldLabel label="Interview Link" optional />
                                <Input
                                    name="interviewLink"
                                    control={control}
                                    errors={errors}
                                    placeholder="e.g. https://meet.google.com/..."
                                />
                            </View>
                        )}
                    </VStack>

                    {/* Recruiter */}
                    <SectionLabel label="Recruiter / HR" />
                    <VStack className="gap-4">
                        <View>
                            <FieldLabel label="Name" optional />
                            <Input name="recruiterName" control={control} errors={errors} placeholder="e.g. Jane Doe" />
                        </View>
                        <View>
                            <FieldLabel label="Contact" optional />
                            <Input
                                name="recruiterContact"
                                control={control}
                                errors={errors}
                                placeholder="e.g. jane@google.com or LinkedIn URL"
                            />
                        </View>
                    </VStack>

                    {/* Notes */}
                    <SectionLabel label="Notes" />
                    <View>
                        <FieldLabel label="Additional Notes" optional />
                        <Input
                            name="notes"
                            control={control}
                            errors={errors}
                            placeholder="Anything worth remembering..."
                            multiline
                        />
                    </View>

                    {/* Submit */}
                    <VStack className="mb-8 mt-10 gap-3">
                        {errorMessage && <AlertMessage type="error" message={errorMessage} />}

                        <Button
                            title={loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Application'}
                            onPress={onPress}
                            disabled={loading || deleting}
                        />

                        {isEdit && (
                            <Pressable
                                onPress={onDelete}
                                disabled={deleting || loading}
                                className="items-center rounded-xl border border-red-200 bg-red-50 py-3 active:opacity-70">
                                <Text className="text-sm font-medium text-red-500">
                                    {deleting ? 'Deleting...' : 'Delete Application'}
                                </Text>
                            </Pressable>
                        )}
                    </VStack>
                </VStack>
            </VStack>
        </ScreenContainer>
    );
};
