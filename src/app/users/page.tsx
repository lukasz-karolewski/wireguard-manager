import Image from "next/image";

import { Card } from "~/components/ui/card";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/server";

const UserPage: React.FC = async () => {
  const users = await api.user.getAllUsers.query();

  return (
    <>
      <PageHeader title="Users" />
      <div className="container">
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <div className="flex items-center gap-3">
                {user.image && (
                  <Image
                    alt={user.name ?? "User"}
                    className="h-10 w-10 rounded-full"
                    height={40}
                    src={user.image}
                    width={40}
                  />
                )}
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {user.defaultSite && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Default Site:</span> {user.defaultSite.name}
                </div>
              )}

              {user.clientCount > 0 && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Clients created:</span> {user.clientCount}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserPage;
