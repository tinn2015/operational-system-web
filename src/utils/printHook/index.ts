import { useEffect, useRef, useState } from "react";
import { HomeLogic } from "./HomeLogic";

function usePrint() {
    /**
  * 使用 useState 创建了一个状态变量 _ （实际未使用，仅用于强制更新）
  */
    const [_, setForceUpdate] = useState(0);
    /**
     * 使用 useRef 创建了一个 homeLogicRef 引用，初始值为 null
     */
    const homeLogicRef = useRef<HomeLogic | null>(null);
    /**
   * 强制更新组件的函数。
   * 通过增加状态值来触发组件的重新渲染。
   */
    const forceUpdate = () => setForceUpdate(prev => prev + 1);

    /**
     * 在组件挂载时初始化 [HomeLogic](./pc-react/src/HomeLogic.ts#L21-L482) 实例，并执行打印机的初始化和扫描操作。
     * 在组件卸载时进行清理操作，如关闭 socket 连接。
     * 空依赖数组 [] 表示这个effect只在组件挂载时执行一次
     */
    useEffect(() => {
        homeLogicRef.current = new HomeLogic(forceUpdate);
        homeLogicRef.current.initialize();
        console.log("打印服务实例完成");
        return () => {
            // 清理操作，如关闭 socket 连接
            if (homeLogicRef.current && homeLogicRef.current.socketData) {
                homeLogicRef.current.socketData.close();
            }
        };
    }, []);

    const logic = homeLogicRef.current;

    // 检查服务状态
    // const checkServerStatus = () => {
    //     if (logic && logic.printSocketOpen) {
    //         return true;
    //     }
    //     return false;
    // }
    // 获取usb打印机列表
    const getPrinterList = () => {
        if (logic) {
            console.log("usbPrinters", logic.usbPrinters);
            return Object.keys(logic.usbPrinters);
        }
        return [];
    }

    // 更新打印机列表
    const updatePrinterList = () => {
        if (logic) {
            logic.getPrinters();
        }
    }

    // 链接打印机
    const connectPrinter = () => {
        if (logic) {
            logic.selectOnLineUsbPrinter();
        }
    }

    // 检查打印机连接状态
    // const checkConnectStatus = () => {
    //     if (logic) {
    //         return logic.onlineUsbBool;
    //     }
    //     return false;
    // }

    // 打印初始化
    const printInit = () => {
        if (logic) {
            logic.init();
        }
    }
    return {
        getPrinterList,
        updatePrinterList,
        connectPrinter,
        printInit,
        logic
    }
}

export default usePrint;