import { InputNumber, Select, Space } from 'antd';
import React from 'react';

interface AutoRefreshControlsProps {
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (value: number) => void;
  minInterval?: number;
  maxInterval?: number;
}

const AutoRefreshControls: React.FC<AutoRefreshControlsProps> = ({
  autoRefresh,
  setAutoRefresh,
  refreshInterval,
  setRefreshInterval,
  minInterval = 5,
  maxInterval = 3600,
}) => {
  return (
    <Space>
      <span>自动刷新:</span>
      <Select
        value={autoRefresh}
        options={[
          { value: true, label: '开启' },
          { value: false, label: '关闭' },
        ]}
        style={{ width: 80 }}
        onChange={(value) => setAutoRefresh(value)}
      />
      <span>间隔:</span>
      <InputNumber
        min={minInterval}
        max={maxInterval}
        disabled={true}
        value={refreshInterval}
        onChange={(value) => setRefreshInterval(value || 60)}
        addonAfter="秒"
        style={{ width: 120 }}
      />
    </Space>
  );
};

export default AutoRefreshControls;
