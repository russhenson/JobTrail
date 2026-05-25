import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
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
} from '@_components';
import { useForm, useWatch } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@_utils';
import { useQueryClient } from '@tanstack/react-query';

import { JOB_STATUSES, JOB_TYPES, JOB_SETUPS } from '@_constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Form'>;

type Form = {
    company: string;
    role: string;
    location: string;
    dateApplied: string;
    salary: string;
    applicationLink: string;
    interviewDatetime: string;
    interviewLink: string;
    notes: string;
    recruiterName: string;
    recruiterContact: string;
};

export const JobFormScreen: React.FC<Props> = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();

    const jobId = route.params?.jobId;
    const isEdit = !!jobId;

    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<Form>({
        defaultValues: {
            company: '',
            role: '',
            location: '',
            dateApplied: '',
            salary: '',
            applicationLink: '',
            interviewDatetime: '',
            interviewLink: '',
            notes: '',
            recruiterName: '',
            recruiterContact: '',
        },
    });

    const [status, setStatus] = useState('');
    const [jobType, setJobType] = useState('');
    const [jobSetup, setJobSetup] = useState('');
    const [statusError, setStatusError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const [setupError, setSetupError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const interviewDatetime = useWatch({ control, name: 'interviewDatetime' });

    const onPress = () => {
        // validate chips first regardless of RHF
        const hasStatusError = !status;
        const hasTypeError = !jobType;
        const hasSetupError = !jobSetup;

        setStatusError(hasStatusError);
        setTypeError(hasTypeError);
        setSetupError(hasSetupError);

        // then let RHF validate its own fields
        handleSubmit(onSubmit)();
    };

    const onSubmit = async (data: Form) => {
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
            await api.post('/jobs', payload);
            await queryClient.invalidateQueries({ queryKey: ['jobs'] });
            navigation.goBack();
        } catch (err: any) {
            console.error('CREATE JOB ERROR:', err.response?.data || err.message);
            setErrorMessage(err.response?.data?.error || 'Failed to save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer noPadding keyboardAvoid scrollable>
            <VStack className="flex-1">
                {/* Header */}
                <View
                    className="items-center justify-center bg-brand-default px-6 pb-6 pt-14"
                    style={{ paddingTop: insets.top + 10 }}>
                    <Text className="text-2xl font-bold text-white">
                        {isEdit ? 'Fixing Your Lies' : 'Adding to the Pile'}
                    </Text>
                    <Text className="mt-1 text-sm text-white/70">
                        {isEdit
                            ? 'Something changed? Or you just finally read the job post.'
                            : "Spray and pray. We don't judge."}
                    </Text>
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
                            <Input
                                name="dateApplied"
                                control={control}
                                errors={errors}
                                placeholder="e.g. 12 Jan 2025"
                                required
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
                            <Input
                                name="interviewDatetime"
                                control={control}
                                errors={errors}
                                placeholder="e.g. 20 Jan 2025, 10:00 AM"
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
                            disabled={loading}
                        />
                        <Pressable onPress={() => navigation.goBack()} className="items-center py-2 active:opacity-60">
                            <Text className="text-sm text-brand-subtext">Cancel</Text>
                        </Pressable>
                    </VStack>
                </VStack>
            </VStack>
        </ScreenContainer>
    );
};
