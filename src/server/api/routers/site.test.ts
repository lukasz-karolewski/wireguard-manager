import type { TrpcContext } from "~/server/api/trpc";

import { siteRouter } from "./site";

jest.mock("server-only", () => ({}));
jest.mock("~/auth", () => ({ auth: {} }));
jest.mock("~/server/db", () => ({ db: {} }));
jest.mock("~/server/utils/execShellCommand", () => ({ execShellCommand: jest.fn() }));

const PUBLIC_KEY = "a".repeat(44);

function createCaller(db: Record<string, unknown>) {
  const ctx = { db, headers: new Headers(), session: { user: { id: "user-1" } } };
  return siteRouter.createCaller(ctx as unknown as TrpcContext);
}

describe("siteRouter", () => {
  test("create should create a new site and mark it as default", async () => {
    const createdSite = { id: 1, name: "Site 1" };
    const tx = {
      auditLog: { create: jest.fn().mockResolvedValue({}) },
      site: { create: jest.fn().mockResolvedValue(createdSite) },
      user: { update: jest.fn().mockResolvedValue({}) },
    };
    const db = { $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)) };

    const result = await createCaller(db).create({
      config_path: "/path/to/config",
      dns: "8.8.8.8",
      dns_pihole: "192.168.0.2",
      endpointAddress: "172.16.0.1",
      id: 1,
      listenPort: 51_820,
      localAddresses: "192.168.0.1,10.0.0.0/24",
      markAsDefault: true,
      name: "Site 1",
      public_key: PUBLIC_KEY,
    });

    expect(result).toEqual(createdSite);
    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.site.create).toHaveBeenCalledWith({
      data: {
        configPath: "/path/to/config",
        DNS: "8.8.8.8",
        endpointAddress: "172.16.0.1",
        hostname: undefined,
        id: 1,
        listenPort: 51_820,
        localAddresses: "192.168.0.1, 10.0.0.0/24",
        name: "Site 1",
        piholeDNS: "192.168.0.2",
        postDown: undefined,
        postUp: undefined,
        privateKey: null,
        publicKey: PUBLIC_KEY,
      },
    });
    expect(tx.user.update).toHaveBeenCalledWith({
      data: { defaultSiteId: 1 },
      where: { id: "user-1" },
    });
    expect(tx.auditLog.create).toHaveBeenCalledTimes(1);
  });

  test("getAll should return all sites with default flag and assigned network", async () => {
    const db = {
      settings: { findFirst: jest.fn().mockResolvedValue({ name: "wg_network", value: "172.16.0.0/16" }) },
      site: {
        findMany: jest.fn().mockResolvedValue([
          { clients: [], hostname: null, id: 1, name: "Site 1" },
          { clients: [], hostname: null, id: 2, name: "Site 2" },
        ]),
      },
      user: { findFirst: jest.fn().mockResolvedValue({ defaultSiteId: 2 }) },
    };

    const sites = await createCaller(db).getAll();

    expect(db.settings.findFirst).toHaveBeenCalledWith({ where: { name: "wg_network" } });
    expect(sites).toEqual([
      expect.objectContaining({ assignedNetwork: "172.16.1.0/24", id: 1, isDefault: false, name: "Site 1" }),
      expect.objectContaining({ assignedNetwork: "172.16.2.0/24", id: 2, isDefault: true, name: "Site 2" }),
    ]);
  });
});
