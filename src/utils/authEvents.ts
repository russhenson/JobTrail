// Simple event bus used to notify RootNavigator when login/logout happens
// so it can re-check the token and switch between AuthNavigator and AppNavigator
type Listener = () => void;

let listeners: Listener[] = [];

export const authEvents = {
    emit() {
        listeners.forEach(fn => fn());
    },

    subscribe(fn: Listener) {
        listeners.push(fn);

        return () => {
            listeners = listeners.filter(l => l !== fn);
        };
    },
};
