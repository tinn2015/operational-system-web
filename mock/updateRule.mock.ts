// @ts-ignore
import { Request, Response } from 'express';

export default {
  'PUT /api/rule': (req: Request, res: Response) => {
    res.status(200).send({
      key: 70,
      disabled: false,
      href: 'https://ant.design',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      name: '方丽',
      owner: 'Gonzalez',
      desc: '调音入术革八构利学转志设信装总。',
      callNo: 66,
      status: 100,
      updatedAt: 'I)f',
      createdAt: 's[ytfP',
      progress: 90,
    });
  },
};
