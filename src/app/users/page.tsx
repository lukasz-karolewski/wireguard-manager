import { UserGrid } from "~/components/app/UserGrid";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/server";

const UserPage: React.FC = async () => {
  const users = await api.user.getAllUsers.query();

  return (
    <>
      <PageHeader title="Users" />
      <div className="container">
        <UserGrid users={users} />
      </div>
    </>
  );
};

export default UserPage;
