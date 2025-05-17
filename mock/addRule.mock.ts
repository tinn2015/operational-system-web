// @ts-ignore
import { Request, Response } from 'express';

export default {
  'POST /api/rule': (req: Request, res: Response) => {
    res.status(200).send({
      key: 91,
      disabled: true,
      href: 'https://umijs.org/',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
      name: '董艳',
      owner: 'Davis',
      desc: '器低立动金建效和交外难素。',
      callNo: 99,
      status: 76,
      updatedAt: 'JKStg',
      createdAt: 'WOm',
      progress: 70,
    });
  },
};
