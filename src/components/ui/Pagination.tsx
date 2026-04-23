import React from "react";
import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(currentPage - 3, 0),
    Math.min(currentPage + 2, totalPages)
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
      <div className="text-sm text-secondary-500">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-xl px-4 py-2"
        >
          Previous
        </Button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-10 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
              page === currentPage
                ? "border-primary bg-primary text-white"
                : "border-secondary-200 bg-white text-secondary-700 hover:border-primary/40 hover:text-primary"
            }`}
          >
            {page}
          </button>
        ))}
        <Button
          variant="outline"
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-xl px-4 py-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
