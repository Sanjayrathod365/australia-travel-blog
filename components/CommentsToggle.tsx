"use client";

import { MessageSquare, MessageSquareOff } from "lucide-react";

interface CommentsToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function CommentsToggle({ enabled, onChange }: CommentsToggleProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Comments</h3>
          <p className="text-sm text-gray-500 mt-1">
            Allow visitors to leave comments on this post
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange(!enabled)}
          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            enabled
              ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {enabled ? (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments Enabled
            </>
          ) : (
            <>
              <MessageSquareOff className="h-4 w-4 mr-2" />
              Comments Disabled
            </>
          )}
        </button>
      </div>
    </div>
  );
} 