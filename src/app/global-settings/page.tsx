import { api } from "~/trpc/server";

const GlobalSettingsPage: React.FC = async () => {
  const { settings } = await api.settings.getAllSettings.query();
  return (
    <div>
      global settings page
      <pre>{JSON.stringify(settings)} </pre>
    </div>
  );
};

export default GlobalSettingsPage;
