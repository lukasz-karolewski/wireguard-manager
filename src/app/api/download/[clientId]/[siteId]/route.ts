import archiver from "archiver";
import { api } from "~/trpc/server";

export async function POST(
  req: Request,
  { params }: { params: { clientId: string; siteId: string } },
) {
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
      name: `${data.client.name}-${config.type}.conf`,
    });
  });

  // ...

  await archive.finalize();

  const headers = new Headers();
  headers.append(
    "Content-Disposition",
    `attachment; filename=wg-${configsForRequestedSite.site.name}-${data.client.name}.zip`,
  );
  headers.append("Content-Type", "application/zip");

  return new Response(archive as unknown as ReadableStream, {
    headers,
  });
}
