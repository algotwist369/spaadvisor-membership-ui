import React from "react";

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  eyebrow,
  title,
  description,
}) => {
  return (
    <header>
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-bold text-secondary-900">{title}</h1>
      {description ? <p className="mt-3 max-w-3xl text-secondary-500">{description}</p> : null}
    </header>
  );
};
