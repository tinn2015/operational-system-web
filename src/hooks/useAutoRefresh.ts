import { useEffect, useRef, useState } from 'react';

/**
 * 自动刷新Hook
 * @param refreshCallback 刷新回调函数
 * @param defaultInterval 默认刷新间隔(秒)
 * @param defaultAutoRefresh 默认是否开启自动刷新
 */
const useAutoRefresh = (
    refreshCallback: () => void,
    defaultInterval: number = 120,
    defaultAutoRefresh: boolean = true,
) => {
    const [refreshInterval, setRefreshInterval] = useState<number>(defaultInterval);
    const [autoRefresh, setAutoRefresh] = useState<boolean>(defaultAutoRefresh);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 设置定时刷新
    useEffect(() => {
        // 清除之前的定时器
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // 如果启用了自动刷新，则创建新的定时器
        if (autoRefresh && refreshInterval > 0) {
            timerRef.current = setInterval(() => {
                refreshCallback();
            }, refreshInterval * 1000);
        }

        // 组件卸载时清除定时器
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [autoRefresh, refreshInterval, refreshCallback]);

    // 手动刷新
    const refresh = () => {
        refreshCallback();
    };

    return {
        refreshInterval,
        setRefreshInterval,
        autoRefresh,
        setAutoRefresh,
        refresh,
    };
};

export default useAutoRefresh; 