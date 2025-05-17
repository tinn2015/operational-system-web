// @ts-ignore
import { Request, Response } from 'express';

export default {
  'GET /api/currentUser': (req: Request, res: Response) => {
    res.status(200).send({
      name: '薛强',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      userid: '998E3fD3-E9eF-bD78-C735-7D3B151d6CbC',
      email: 'b.klndumsvt@bpkxtbubet.fj',
      signature: '长省县难信更不单又北关合门部验向很铁。',
      title: '不权去每单元成很地族着金没说。',
      group: '服务技术部',
      tags: [
        { key: 1, label: '专注设计' },
        { key: 2, label: '大咖' },
      ],
      notifyCount: 92,
      unreadCount: 90,
      country: '韩国',
      access: '理前约值并行完更感什声县究段。',
      geographic: { province: { label: '吉林省', key: 3 }, city: { label: '固原市', key: 4 } },
      address: '青海省 海南藏族自治州 兴海县',
      phone: '11286507400',
    });
  },
};
