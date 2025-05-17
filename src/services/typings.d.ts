declare namespace API {
    type Headset = {
        id: number;
        // 头显编码
        headsetNo: string;
        // 头显ip   
        headsetIp: string;
        // 网络类型
        networkType: number;
        // 头显类型 1：头显、2：一体机
        headsetType: number;
        // 头显状态
        headsetStatus: number;
        // 串流状态，0：停止，1正常，2未知
        status: number;
        // 剩余电量
        remainElectricity: number;
    }
    type HeadsetList = {
        code: number;
        message: string;
        errorInfo: string;
        data: {
            total: number;
            pageSize: number;
            pageNum: number;
            data: Headset[];
        }
    }
}

