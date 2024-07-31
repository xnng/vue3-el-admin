import { ILogger, loggers } from '@midwayjs/logger';
import { Logger as TypeOrmLogger } from 'typeorm';
import { ILoggerType } from '../interface';

// 格式：type querytime error query parameters
export class MyTypeormLogger implements TypeOrmLogger {
  private logger: ILogger;
  private openQueryLog = false;

  logQuery(query: string, parameters?: any[]) {
    if (!this.logger) {
      this.logger = loggers.getLogger('sqlLogger');
    }
    if (this.openQueryLog) {
      this.logger.info(
        `type: ${ILoggerType.info}; querytime: -1; error: null; query: ${query}; parameters: ${parameters}`
      );
    }
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logger.error(
      `type: ${ILoggerType.error}; querytime: -1; error: ${error}; query: ${query}; parameters: ${parameters}`
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(
      `type: ${ILoggerType.slow}; querytime: ${time}; error: null; query: ${query}; parameters: ${parameters}`
    );
  }

  logSchemaBuild() {}

  logMigration() {}

  log() {}
}
