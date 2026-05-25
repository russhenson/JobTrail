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
