import { MidwayConfig } from '@midwayjs/core';

export default {
  keys: '1641787853603_96702',
  prometheus: {
    labels: {
      APP_NAME: 'el-admin',
    },
  },
  bodyParser: {
    enableTypes: ['json', 'form', 'text', 'xml'],
    formLimit: '1mb',
    jsonLimit: '1mb',
    textLimit: '1mb',
    xmlLimit: '1mb',
  },
  midwayLogger: {
    default: {
      level: 'info',
      transports: {
        console: {},
        file: {
          maxSize: '20m',
          maxFiles: '3d',
          dir: './logs',
        },
        error: {
          maxSize: '20m',
          maxFiles: '3d',
          dir: './logs',
        },
      },
    },
    clients: {
      sqlLogger: {
        fileLogName: 'sqlLogger.log',
      },
      httpLogger: {
        fileLogName: 'httpLogger.log',
      },
    },
  },
} as MidwayConfig;
