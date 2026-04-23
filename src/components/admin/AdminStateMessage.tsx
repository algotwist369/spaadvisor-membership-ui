import React from "react";

interface AdminStateMessageProps {
  message: string;
  variant?: "loading" | "empty";
}

export const AdminStateMessage: React.FC<AdminStateMessageProps> = ({
  message,
  variant = "empty",
}) => {
  if (variant === "loading") {
    return <div className="py-14 text-center text-secondary-500">{message}</div>;
  }

  return (
    <div className="rounded-2xl border border-dashed border-secondary-200 bg-secondary-50 px-6 py-12 text-center text-secondary-500">
      {message}
    </div>
  );
};
