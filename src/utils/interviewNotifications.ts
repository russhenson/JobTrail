import notifee, { TriggerType, AndroidImportance } from '@notifee/react-native';
import dayjs from 'dayjs';

const CHANNEL_ID = 'interview-reminders';

const ensureChannel = async () => {
    await notifee.createChannel({
        id: CHANNEL_ID,
        name: 'Interview Reminders',
        importance: AndroidImportance.HIGH,
    });
};

export const scheduleInterviewNotifications = async (job: {
    id: string;
    role: string;
    company: string;
    interviewDatetime: string;
}) => {
    const interviewTime = dayjs(job.interviewDatetime);

    // only schedule if interview is in the future
    if (!interviewTime.isAfter(dayjs())) return;

    await ensureChannel();

    const triggers = [
        { seconds: 10, label: '10 seconds' },
        { seconds: 30, label: '30 seconds' },
        { seconds: 60, label: '1 minute' },
    ];

    for (const { seconds, label } of triggers) {
        const fireAt = dayjs().add(seconds, 'second');

        await notifee.createTriggerNotification(
            {
                id: `interview-${job.id}-${seconds}`,
                title: '📅 Interview Reminder',
                body: `${label} reminder: ${job.role} at ${job.company} — ${interviewTime.format('MMM D [at] h:mm A')}`,
                android: {
                    channelId: CHANNEL_ID,
                    importance: AndroidImportance.HIGH,
                    pressAction: { id: 'default' },
                },
                ios: {
                    sound: 'default',
                },
            },
            {
                type: TriggerType.TIMESTAMP,
                timestamp: fireAt.valueOf(),
            },
        );
    }

    console.log(`Scheduled 3 notifications for interview: ${job.role} at ${job.company}`);
};

export const cancelInterviewNotifications = async (jobId: string) => {
    const triggers = [10, 30, 60];
    await Promise.all(triggers.map(seconds => notifee.cancelNotification(`interview-${jobId}-${seconds}`)));
};
