import Image from "next/image";
import { FC } from "react";

import type { RouterOutputs } from "~/trpc/shared";

import { Badge } from "../ui/badge";
import { StatusIndicator } from "../ui/status-indicator";

interface UserItemProps {
  user: RouterOutputs["user"]["getAllUsers"][0];
}

export const UserItem: FC<UserItemProps> = ({ user }) => {
  const hasDevices = user.deviceCount > 0;
  const hasDefaultSite = !!user.defaultSite;

  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-out hover:shadow-md hover:border-gray-300">
        {/* Status indicator */}
        <StatusIndicator type={hasDevices ? "active" : "inactive"} />

        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {user.image ? (
                <Image
                  alt={user.name ?? "User"}
                  className="h-12 w-12 rounded-full ring-2 ring-gray-100"
                  height={48}
                  src={user.image}
                  width={48}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-2 ring-gray-100">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {user.name ?? "Unnamed User"}
                </h3>
                {!hasDefaultSite && <Badge variant="error">No Default Site</Badge>}
              </div>

              <p className="text-sm text-gray-600 truncate mb-3">{user.email}</p>

              {/* User Details */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="ml-2">
                    {user.deviceCount} {user.deviceCount === 1 ? "device" : "devices"} owned
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="ml-2">
                    {user.clientCount} {user.clientCount === 1 ? "client" : "clients"} created
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    </div>
  );
};
