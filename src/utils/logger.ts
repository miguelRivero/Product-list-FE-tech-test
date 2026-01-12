/**
 * Logger service for application logging
 * Replaces console.error with a structured logging approach
 */

type LogLevel = "error" | "warn" | "info" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  error?: Error;
  context?: Record<string, unknown>;
  timestamp: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  private formatMessage(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : "";
    const errorStr = error
      ? ` | Error: ${error.message}${error.stack ? `\n${error.stack}` : ""}`
      : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}${errorStr}`;
  }

  private addLog(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    const logEntry: LogEntry = {
      level,
      message,
      error,
      context,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // In development, also log to console
    if (this.isDevelopment) {
      const formatted = this.formatMessage(level, message, error, context);
      switch (level) {
        case "error":
          console.error(formatted);
          break;
        case "warn":
          console.warn(formatted);
          break;
        case "info":
          // eslint-disable-next-line no-console
          console.info(formatted);
          break;
        case "debug":
          // eslint-disable-next-line no-console
          console.debug(formatted);
          break;
      }
    }

    // In production, you could send logs to a logging service
    // Example: sendToLoggingService(logEntry);
  }

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    this.addLog("error", message, error, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.addLog("warn", message, undefined, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.addLog("info", message, undefined, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.addLog("debug", message, undefined, context);
    }
  }

  /**
   * Get recent logs (useful for debugging)
   */
  getRecentLogs(level?: LogLevel, limit = 10): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }
    return filtered.slice(-limit);
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }
}

export const logger = new Logger();
