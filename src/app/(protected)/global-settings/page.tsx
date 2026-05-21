import { GlobalSettingsForm } from "~/components/app/GlobalSettingsForm";
import { Card } from "~/components/ui/card";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/server";

const GlobalSettingsPage: React.FC = async () => {
  const settings = await api.settings.getAllSettings.query();

  return (
    <>
      <PageHeader title="Global settings" />
      <div className="container">
        <Card>
          <GlobalSettingsForm settings={settings} />
        </Card>
      </div>
    </>
  );
};

export default GlobalSettingsPage;
