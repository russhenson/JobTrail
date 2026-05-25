import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

export const ScreenContainer = ({
    children,
    safeAreaTop,
    safeAreaBottom,
    noPadding,
    className,
    scrollable,
    keyboardAvoid,
}: {
    children: React.ReactNode;
    safeAreaTop?: boolean;
    safeAreaBottom?: boolean;
    noPadding?: boolean;
    className?: string;
    scrollable?: boolean;
    keyboardAvoid?: boolean;
}) => {
    const safeAreaEdges: Edge[] = ['left', 'right'];

    if (safeAreaTop) safeAreaEdges.push('top');
    if (safeAreaBottom) safeAreaEdges.push('bottom');

    const paddingClass = noPadding ? 'p-0' : 'p-4';

    let content = children;

    if (scrollable) {
        content = (
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                className={paddingClass}
                contentContainerStyle={{ flexGrow: 1 }}>
                {content}
            </ScrollView>
        );
    }

    if (keyboardAvoid) {
        content = (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                {content}
            </KeyboardAvoidingView>
        );
    }

    return (
        <SafeAreaView
            edges={safeAreaEdges}
            className={`bg-white ${className} flex-1 ${!scrollable ? paddingClass : ''}`}>
            {content}
        </SafeAreaView>
    );
};
