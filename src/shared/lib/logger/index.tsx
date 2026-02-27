export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogMetadata {
    [key: string]: unknown;
}

const shouldLogDebug = process.env.NODE_ENV !== "production";

const debugMethod = console.debug
    ? console.debug.bind(console)
    : console.info.bind(console);

function normalizeValue(value: unknown): unknown {
    if (value instanceof Error) {
        return {
            name: value.name,
            message: value.message,
            stack: value.stack,
        };
    }

    if (typeof value === "bigint") {
        return value.toString();
    }

    return value;
}

function normalizeMetadata(metadata?: LogMetadata): LogMetadata | undefined {
    if (!metadata) {
        return undefined;
    }

    return Object.fromEntries(
        Object.entries(metadata).map(([key, value]) => [
            key,
            normalizeValue(value),
        ]),
    );
}

function formatMessage(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata,
): string {
    const timestamp = new Date().toISOString();
    const normalizedMetadata = normalizeMetadata(metadata);

    if (!normalizedMetadata || Object.keys(normalizedMetadata).length === 0) {
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    try {
        const serializedMetadata = JSON.stringify(normalizedMetadata);
        return `[${timestamp}] [${level.toUpperCase()}] ${message} ${serializedMetadata}`;
    } catch (serializationError) {
        return `[${timestamp}] [${level.toUpperCase()}] ${message} (metadata serialization failed: ${String(
            serializationError,
        )})`;
    }
}

function log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    const formattedMessage = formatMessage(level, message, metadata);

    if (level === "debug") {
        if (!shouldLogDebug) {
            return;
        }

        debugMethod(formattedMessage);
        return;
    }

    switch (level) {
        case "info":
            console.info(formattedMessage);
            break;
        case "warn":
            console.warn(formattedMessage);
            break;
        case "error":
            console.error(formattedMessage);
            break;
    }
}

export const logger = {
    info(message: string, metadata?: LogMetadata) {
        log("info", message, metadata);
    },
    warn(message: string, metadata?: LogMetadata) {
        log("warn", message, metadata);
    },
    error(message: string, metadata?: LogMetadata) {
        log("error", message, metadata);
    },
    debug(message: string, metadata?: LogMetadata) {
        log("debug", message, metadata);
    },
};

export type Logger = typeof logger;
