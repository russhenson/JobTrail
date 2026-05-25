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

    // for demo purposes, we'll schedule 3 notifications at 10s, 30s, and 60s from now
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

    // create a trigger for the exact interview time
    await notifee.createTriggerNotification(
        {
            id: `interview-${job.id}-exact`,
            title: '🚨 Your Interview is Now',
            body: `${job.role} at ${job.company} — Good luck! You've got this.`,
            android: {
                channelId: CHANNEL_ID,
                importance: AndroidImportance.HIGH,
                pressAction: { id: 'default' },
            },
            ios: { sound: 'default' },
        },
        {
            type: TriggerType.TIMESTAMP,
            timestamp: interviewTime.valueOf(), // exact interview time
        },
    );

    console.log(`Scheduled 4 notifications for: ${job.role} at ${job.company}`);
};

export const cancelInterviewNotifications = async (jobId: string) => {
    const ids = [10, 30, 60].map(s => `interview-${jobId}-${s}`);
    ids.push(`interview-${jobId}-exact`); // ← cancel exact too

    await Promise.all(ids.map(id => notifee.cancelNotification(id)));
};
