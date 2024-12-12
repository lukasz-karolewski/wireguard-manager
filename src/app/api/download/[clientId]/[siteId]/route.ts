import archiver from "archiver";
import { clientConfigToString } from "~/server/utils/types";
import { api } from "~/trpc/server";

export async function POST(
  req: Request,
  props: { params: Promise<{ clientId: string; siteId: string }> },
) {
  const params = await props.params;
  const clientId = Number(params.clientId);
  const siteId = Number(params.siteId);

  const data = await api.client.get.query({ id: clientId });
  const configsForRequestedSite = data.configs.filter((config) => config.site.id === siteId).pop();

  if (!configsForRequestedSite) {
    return new Response("Not found", {
      status: 404,
    });
  }

  const archive = archiver("zip");

  configsForRequestedSite.configs.forEach((config) => {
    archive.append(Buffer.from(config.value, "utf-8"), {
      name: `${configsForRequestedSite.site.name}-${clientConfigToString(config.type).replaceAll(" ", "_")}.conf`,
    });
  });

  // ...

  await archive.finalize();

  const headers = new Headers();
  headers.append(
    "Content-Disposition",
    `attachment; filename=wg-config_${data?.client?.name}_at_${configsForRequestedSite.site.name}.zip`,
  );
  headers.append("Content-Type", "application/zip");

  return new Response(archive as unknown as ReadableStream, {
    headers,
  });
}
