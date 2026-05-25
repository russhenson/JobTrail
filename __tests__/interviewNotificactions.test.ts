import notifee from '@notifee/react-native';
import dayjs from 'dayjs';
import { scheduleInterviewNotifications, cancelInterviewNotifications } from '../src/utils/interviewNotifications';

const mockJob = {
    id: 'job123',
    role: 'Senior Designer',
    company: 'Acme Corp',
};

describe('scheduleInterviewNotifications', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should NOT schedule if interview is in the past', async () => {
        await scheduleInterviewNotifications({
            ...mockJob,
            interviewDatetime: dayjs().subtract(1, 'day').toISOString(),
        });

        expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
    });

    it('should NOT schedule if interview is right now', async () => {
        await scheduleInterviewNotifications({
            ...mockJob,
            interviewDatetime: dayjs().toISOString(),
        });

        expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
    });

    it('should schedule 4 notifications if interview is in the future', async () => {
        await scheduleInterviewNotifications({
            ...mockJob,
            interviewDatetime: dayjs().add(1, 'day').toISOString(),
        });

        expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(4);
    });

    it('should schedule notifications with correct ids', async () => {
        await scheduleInterviewNotifications({
            ...mockJob,
            interviewDatetime: dayjs().add(1, 'day').toISOString(),
        });

        const calls = (notifee.createTriggerNotification as jest.Mock).mock.calls;
        const ids = calls.map(([notification]) => notification.id);

        expect(ids).toContain('interview-job123-10');
        expect(ids).toContain('interview-job123-30');
        expect(ids).toContain('interview-job123-60');
        expect(ids).toContain('interview-job123-exact');
    });

    it('should fire at 10s, 30s, 60s from now', async () => {
        const before = dayjs().valueOf();

        await scheduleInterviewNotifications({
            ...mockJob,
            interviewDatetime: dayjs().add(1, 'day').toISOString(),
        });

        const after = dayjs().valueOf();
        const calls = (notifee.createTriggerNotification as jest.Mock).mock.calls;
        const timestamps = calls.map(([, trigger]) => trigger.timestamp as number);

        const [t10, t30, t60] = timestamps;

        expect(t10).toBeGreaterThanOrEqual(before + 10000);
        expect(t10).toBeLessThanOrEqual(after + 10000);

        expect(t30).toBeGreaterThanOrEqual(before + 30000);
        expect(t30).toBeLessThanOrEqual(after + 30000);

        expect(t60).toBeGreaterThanOrEqual(before + 60000);
        expect(t60).toBeLessThanOrEqual(after + 60000);
    });

    it('should schedule exact notification at interview time', async () => {
        const interviewDatetime = dayjs().add(1, 'day').toISOString();

        await scheduleInterviewNotifications({
            ...mockJob,
            interviewDatetime,
        });

        const calls = (notifee.createTriggerNotification as jest.Mock).mock.calls;
        const exactCall = calls.find(([notification]) => notification.id === 'interview-job123-exact');

        expect(exactCall).toBeDefined();
        expect(exactCall[1].timestamp).toBe(dayjs(interviewDatetime).valueOf());
    });
});

describe('cancelInterviewNotifications', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should cancel all 4 notification ids for a job', async () => {
        await cancelInterviewNotifications('job123');

        expect(notifee.cancelNotification).toHaveBeenCalledTimes(4);
        expect(notifee.cancelNotification).toHaveBeenCalledWith('interview-job123-10');
        expect(notifee.cancelNotification).toHaveBeenCalledWith('interview-job123-30');
        expect(notifee.cancelNotification).toHaveBeenCalledWith('interview-job123-60');
        expect(notifee.cancelNotification).toHaveBeenCalledWith('interview-job123-exact');
    });
});
