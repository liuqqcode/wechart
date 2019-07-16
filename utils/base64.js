const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名

function base64src(base64data, cb) {
  const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
  if (!format) {
    return (" a " + new Error('ERROR_BASE64SRC_PARSE'));
  }
  const buffer = wx.base64ToArrayBuffer(bodyData);
  const fsm = wx.getFileSystemManager();
  fsm.writeFile({
    filePath: `${wx.env.USER_DATA_PATH}/test.png`,
    data: buffer,
    encoding: 'binary',
    success() {
      cb(filePath);
    },
    fail() {
      return (" b " + new Error('ERROR_BASE64SRC_WRITE'));
    },
  });
};

export { base64src };