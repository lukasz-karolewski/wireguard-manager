import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/server";

const UserPage: React.FC = async () => {
  const users = await api.user.getAllUsers.query();

  return (
    <>
      <PageHeader title={`Users`}></PageHeader>
      <div className="container">
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} {user.email}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserPage;
