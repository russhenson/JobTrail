import React from 'react';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

export const ScreenContainer = ({
    children,
    safeAreaTop,
    safeAreaBottom,
    noPadding,
    className,
}: {
    children: React.ReactNode;
    safeAreaTop?: boolean;
    safeAreaBottom?: boolean;
    noPadding?: boolean;
    className?: string;
}) => {
    const safeAreaEdges: Edge[] = ['left', 'right'];

    if (safeAreaTop) {
        safeAreaEdges.push('top');
    }

    if (safeAreaBottom) {
        safeAreaEdges.push('bottom');
    }

    return (
        <SafeAreaView edges={safeAreaEdges} className={`bg-brand-light ${className} flex-1 ${noPadding ? 'p-0' : 'p-4'}`}>
            {children}
        </SafeAreaView>
    );
};
