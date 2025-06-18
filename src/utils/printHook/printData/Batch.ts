import dayjs from "dayjs";

const offsetX: number = 150;
const offsetY: number = 0;
const width: number = 50;
const height: number = 20;
const rotate: number = 90;
const marginX: number = 1.0;
const marginY: number = 1.0;
const contentWidth: number = width - marginX * 2;
const qrCodeHeight: number = height - marginY;
const qrCodeWidth: number = height - marginY;
const fontSize: number = 4.2;

//批量打印数据
interface InitDrawingBoardParamType {
  width: number;
  height: number;
  rotate: number;
  path: string;
  verticalShift: number;
  HorizontalShift: number;
}

interface QrCodeElementType {
  type: 'qrCode';
  json: {
    x: number;
    y: number;
    height: number;
    width: number;
    value: string;
    codeType: number;
    rotate: number;
  };
}

interface TextElementType {
  type: 'text';
  json: {
    x: number;
    y: number;
    height: number;
    width: number;
    value: string;
    fontFamily: string;
    rotate: number;
    fontSize: number;
    textAlignHorizonral: number;
    textAlignVertical: number;
    letterSpacing: number;
    lineSpacing: number;
    lineMode: number;
    fontStyle: boolean[];
  };
}

type ElementType = QrCodeElementType | TextElementType;

interface BatchDataItemType {
  InitDrawingBoardParam: InitDrawingBoardParamType;
  elements: ElementType[];
}

interface BatchPrintDataType {
  data: BatchDataItemType[];
}

export const createBatchPrintData = (playerIds: string[], productName: string, beginTime: string, endTime: string): BatchPrintDataType => {
  const data: BatchDataItemType[] = [];
  playerIds.forEach((playerId) => {
    data.push({
      InitDrawingBoardParam: {
        width: 300,
        height: height,
        rotate: rotate,
        path: "ZT001.ttf",
        verticalShift: 0,
        HorizontalShift: 0,
      },

      elements: [
        {
          type: "qrCode",
          json: {
            x: marginX + offsetX,
            y: marginY + offsetY,
            height: qrCodeHeight,
            width: qrCodeWidth,
            value: `${playerId}`,
            codeType: 31,
            rotate: 0,
          },
        },
        {
          type: "text",
          json: {
            x: marginX * 2 + qrCodeWidth + offsetX + 10,
            y: marginY + offsetY,
            height: qrCodeHeight,
            width: contentWidth - qrCodeWidth - marginX,
            value: `${productName}\n${dayjs(beginTime).format('HH:mm')}-${dayjs(endTime).format('HH:mm')}\n吾知科技`,
            fontFamily: "宋体",
            rotate: 0,
            fontSize: fontSize,
            textAlignHorizonral: 0,
            textAlignVertical: 1,
            letterSpacing: 0.0,
            lineSpacing: 1.0,
            lineMode: 6,
            fontStyle: [true, false, false, false],
          },
        },
      ],
    });
  });

  return {
    data: data,
  };
};

// example
// export const batchPrintData: BatchPrintDataType = {
//   data: [
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：11\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：12\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：13\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：14\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：15\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：16\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：17\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：18\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：19\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：20\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//     {
//       InitDrawingBoardParam: {
//         width: width,
//         height: height,
//         rotate: rotate,
//         path: "ZT001.ttf",
//         verticalShift: 0,
//         HorizontalShift: 0,
//       },

//       elements: [
//         {
//           type: "qrCode",
//           json: {
//             x: marginX + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: qrCodeWidth,
//             value: "12345678",
//             codeType: 31,
//             rotate: 0,
//           },
//         },
//         {
//           type: "text",
//           json: {
//             x: marginX * 2 + qrCodeWidth + offsetX,
//             y: marginY + offsetY,
//             height: qrCodeHeight,
//             width: contentWidth - qrCodeWidth - marginX,
//             value: "姓名：武汉精臣\n年龄：21\n类型：血液检测",
//             fontFamily: "宋体",
//             rotate: 0,
//             fontSize: fontSize,
//             textAlignHorizonral: 0,
//             textAlignVertical: 1,
//             letterSpacing: 0.0,
//             lineSpacing: 1.0,
//             lineMode: 6,
//             fontStyle: [true, false, false, false],
//           },
//         },
//       ],
//     },
//   ],
// };

// export default textPrintData;
