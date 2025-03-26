type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: any;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metadata ? ' ' + JSON.stringify(metadata) : ''}`;
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata) {
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    const formattedMessage = this.formatMessage(level, message, metadata);
    
    if (metadata) {
      console[consoleMethod](formattedMessage);
    } else {
      console[consoleMethod](formattedMessage);
    }
  }

  debug(message: string, metadata?: LogMetadata) {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: LogMetadata) {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata) {
    this.log('warn', message, metadata);
  }

  error(message: string, error?: Error | unknown) {
    const metadata = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : {
      error: String(error)
    };
    this.log('error', message, metadata);
  }
}

export const logger = new Logger(); 