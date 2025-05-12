import { useModel } from '@umijs/max';
import React from 'react';

const Status: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  console.log('initialState', initialState);
  return <div>Status</div>;
};

export default Status;
