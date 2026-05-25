// mock notifee — no native module in test env
jest.mock('@notifee/react-native', () => ({
    createChannel: jest.fn().mockResolvedValue(undefined),
    createTriggerNotification: jest.fn().mockResolvedValue(undefined),
    cancelNotification: jest.fn().mockResolvedValue(undefined),
    requestPermission: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
    TriggerType: { TIMESTAMP: 0 },
    AndroidImportance: { HIGH: 4 },
}));