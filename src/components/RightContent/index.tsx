import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';
import { Dropdown, Space } from 'antd';
import { useState } from 'react';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return <UmiSelectLang />;
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

export const SelectVenue = ({ options }: { options: any[] }) => {
  // const { initialState, setInitialState } = useModel('@@initialState');
  console.log('SelectVenue options', options);
  const items = options.map((item) => ({
    key: item.id,
    label: item.venueName,
  }));
  const originalVenue =
    options.find((item) => item.id === localStorage.getItem('X-Venue-Id')) || options[0];
  console.log('X-Venue-Id', localStorage.getItem('X-Venue-Id'));
  const [currentVenue, setCurrentVenue] = useState<any>(originalVenue);
  console.log('SelectVenue originalVenue', originalVenue);
  const handleSelect = (key: string) => {
    const currentVenue = options.find((item) => item.id === key);
    console.log('SelectVenue handleSelect', key, currentVenue);
    // setInitialState({
    //   currentUser: {
    //     ...initialState?.currentUser,
    //     currentVenue,
    //   },
    // });
    setCurrentVenue(currentVenue);
    localStorage.setItem('X-Venue-Id', currentVenue.id);
    window.location.reload();
  };
  return (
    <div style={{ height: 44, lineHeight: '44px', display: 'flex', alignItems: 'center' }}>
      <Dropdown
        menu={{ items, onClick: (info) => handleSelect(info.key as string), selectedKeys: [] }}
        trigger={['click']}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {currentVenue?.venueName}
            {/* {initialState?.currentUser?.currentVenue?.venueName} */}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
  // return <div>SelectVenue</div>;
};
