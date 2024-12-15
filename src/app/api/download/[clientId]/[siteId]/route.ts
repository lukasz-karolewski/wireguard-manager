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
  const configsForRequestedSite = data.configs.findLast((config) => config.site.id === siteId);

  if (!data.client?.name) {
    return new Response("Client has no name", {
      status: 500,
    });
  }

  if (!configsForRequestedSite) {
    return new Response("Not found", {
      status: 404,
    });
  }

  const archive = archiver("zip");

  for (const config of configsForRequestedSite.configs) {
    archive.append(Buffer.from(config.value, "utf-8"), {
      name: `${configsForRequestedSite.site.name}-${clientConfigToString(config.type).replaceAll(" ", "_")}.conf`,
    });
  }

  await archive.finalize();

  const headers = new Headers();
  headers.append("Content-Type", "application/zip");
  headers.append(
    "Content-Disposition",
    `attachment; filename=wg-config_${data.client.name}_at_${configsForRequestedSite.site.name}.zip`,
  );

  return new Response(archive as unknown as ReadableStream, {
    headers,
  });
}
