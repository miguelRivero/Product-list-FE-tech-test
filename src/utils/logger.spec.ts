import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { logger } from "./logger";

describe("Logger", () => {
  beforeEach(() => {
    logger.clear();
    // Mock console methods to avoid cluttering test output
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("error", () => {
    it("logs error message", () => {
      logger.error("Test error");

      const logs = logger.getRecentLogs("error");
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("Test error");
      expect(logs[0].level).toBe("error");
      expect(logs[0].error).toBeUndefined();
    });

    it("logs error with Error object", () => {
      const error = new Error("Something went wrong");
      logger.error("Test error", error);

      const logs = logger.getRecentLogs("error");
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("Test error");
      expect(logs[0].error).toBe(error);
    });

    it("logs error with context", () => {
      const context = { userId: 123, action: "delete" };
      logger.error("Test error", undefined, context);

      const logs = logger.getRecentLogs("error");
      expect(logs).toHaveLength(1);
      expect(logs[0].context).toEqual(context);
    });

    it("logs error with Error and context", () => {
      const error = new Error("Something went wrong");
      const context = { userId: 123 };
      logger.error("Test error", error, context);

      const logs = logger.getRecentLogs("error");
      expect(logs).toHaveLength(1);
      expect(logs[0].error).toBe(error);
      expect(logs[0].context).toEqual(context);
    });

    it("calls console.error in development", () => {
      logger.error("Test error");
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("warn", () => {
    it("logs warning message", () => {
      logger.warn("Test warning");

      const logs = logger.getRecentLogs("warn");
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("Test warning");
      expect(logs[0].level).toBe("warn");
    });

    it("logs warning with context", () => {
      const context = { userId: 123 };
      logger.warn("Test warning", context);

      const logs = logger.getRecentLogs("warn");
      expect(logs).toHaveLength(1);
      expect(logs[0].context).toEqual(context);
    });

    it("calls console.warn in development", () => {
      logger.warn("Test warning");
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("info", () => {
    it("logs info message", () => {
      logger.info("Test info");

      const logs = logger.getRecentLogs("info");
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("Test info");
      expect(logs[0].level).toBe("info");
    });

    it("logs info with context", () => {
      const context = { userId: 123 };
      logger.info("Test info", context);

      const logs = logger.getRecentLogs("info");
      expect(logs).toHaveLength(1);
      expect(logs[0].context).toEqual(context);
    });

    it("calls console.info in development", () => {
      logger.info("Test info");
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe("debug", () => {
    it("logs debug message in development", () => {
      logger.debug("Test debug");

      const logs = logger.getRecentLogs("debug");
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("Test debug");
      expect(logs[0].level).toBe("debug");
    });

    it("logs debug with context", () => {
      const context = { userId: 123 };
      logger.debug("Test debug", context);

      const logs = logger.getRecentLogs("debug");
      expect(logs).toHaveLength(1);
      expect(logs[0].context).toEqual(context);
    });

    it("calls console.debug in development", () => {
      logger.debug("Test debug");
      expect(console.debug).toHaveBeenCalled();
    });
  });

  describe("getRecentLogs", () => {
    it("returns empty array when no logs exist", () => {
      const logs = logger.getRecentLogs();
      expect(logs).toEqual([]);
    });

    it("returns all logs when no level specified", () => {
      logger.error("Error 1");
      logger.warn("Warning 1");
      logger.info("Info 1");

      const logs = logger.getRecentLogs(undefined, 100);
      expect(logs).toHaveLength(3);
    });

    it("filters logs by level", () => {
      logger.error("Error 1");
      logger.error("Error 2");
      logger.warn("Warning 1");
      logger.info("Info 1");

      const errorLogs = logger.getRecentLogs("error");
      expect(errorLogs).toHaveLength(2);
      expect(errorLogs.every(log => log.level === "error")).toBe(true);
    });

    it("returns limited number of logs", () => {
      // Add 15 logs
      for (let i = 0; i < 15; i++) {
        logger.info(`Info ${i}`);
      }

      const logs = logger.getRecentLogs("info", 10);
      expect(logs).toHaveLength(10);
      expect(logs[0].message).toBe("Info 5"); // Should return last 10
      expect(logs[9].message).toBe("Info 14");
    });

    it("returns all logs when limit exceeds available logs", () => {
      logger.info("Info 1");
      logger.info("Info 2");

      const logs = logger.getRecentLogs("info", 10);
      expect(logs).toHaveLength(2);
    });

    it("returns last logs in chronological order", () => {
      logger.info("Info 1");
      logger.info("Info 2");
      logger.info("Info 3");

      const logs = logger.getRecentLogs("info");
      expect(logs[0].message).toBe("Info 1");
      expect(logs[1].message).toBe("Info 2");
      expect(logs[2].message).toBe("Info 3");
    });
  });

  describe("log storage", () => {
    it("stores logs with timestamp", () => {
      logger.info("Test message");

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].timestamp).toBeDefined();
      expect(new Date(logs[0].timestamp).getTime()).toBeLessThanOrEqual(
        Date.now()
      );
    });

    it("limits logs to maxLogs (100)", () => {
      // Add 105 logs
      for (let i = 0; i < 105; i++) {
        logger.info(`Info ${i}`);
      }

      const logs = logger.getRecentLogs(undefined, 200); // Pass high limit to get all stored logs
      expect(logs).toHaveLength(100);
      // First log should be Info 5 (105 - 100 = 5)
      expect(logs[0].message).toBe("Info 5");
      // Last log should be Info 104
      expect(logs[99].message).toBe("Info 104");
    });

    it("maintains log order when exceeding maxLogs", () => {
      // Add 105 logs
      for (let i = 0; i < 105; i++) {
        logger.info(`Info ${i}`);
      }

      const logs = logger.getRecentLogs(undefined, 200); // Pass high limit to get all stored logs
      expect(logs).toHaveLength(100);
      // Verify order is maintained
      for (let i = 0; i < logs.length - 1; i++) {
        const current = parseInt(logs[i].message.split(" ")[1] || "0");
        const next = parseInt(logs[i + 1].message.split(" ")[1] || "0");
        expect(next).toBeGreaterThan(current);
      }
    });
  });

  describe("clear", () => {
    it("clears all logs", () => {
      logger.error("Error 1");
      logger.warn("Warning 1");
      logger.info("Info 1");

      logger.clear();

      const logs = logger.getRecentLogs();
      expect(logs).toEqual([]);
    });

    it("allows logging after clear", () => {
      logger.info("Info 1");
      logger.clear();
      logger.info("Info 2");

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe("Info 2");
    });
  });

  describe("log entry structure", () => {
    it("creates log entry with all fields", () => {
      const error = new Error("Test error");
      const context = { key: "value" };
      logger.error("Test message", error, context);

      const logs = logger.getRecentLogs("error");
      expect(logs[0]).toMatchObject({
        level: "error",
        message: "Test message",
        error,
        context,
      });
      expect(logs[0].timestamp).toBeDefined();
    });

    it("creates log entry without optional fields", () => {
      logger.info("Test message");

      const logs = logger.getRecentLogs("info");
      expect(logs[0]).toMatchObject({
        level: "info",
        message: "Test message",
      });
      expect(logs[0].error).toBeUndefined();
      expect(logs[0].context).toBeUndefined();
      expect(logs[0].timestamp).toBeDefined();
    });
  });
});
