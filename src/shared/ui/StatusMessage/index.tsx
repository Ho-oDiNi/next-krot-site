import { cn } from "@/shared/lib/cn";

interface StatusMessageProps {
    message?: string | null;
    success?: boolean;
    className?: string;
}

const StatusMessage = ({ message, success, className }: StatusMessageProps) => {
    if (!message) {
        return null;
    }

    return (
        <div
            className={cn(
                "rounded p-4",
                success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800",
                className,
            )}
        >
            {message}
        </div>
    );
};

export default StatusMessage;
