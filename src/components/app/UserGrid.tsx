import type { FC } from "react";

import type { RouterOutputs } from "~/trpc/shared";

import { UserItem } from "./UserItem";

interface UserGridProps {
  users: RouterOutputs["user"]["getAllUsers"];
}

export const UserGrid: FC<UserGridProps> = ({ users }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-600">There are no users in the system yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
};
