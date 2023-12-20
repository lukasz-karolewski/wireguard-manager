import { siteRouter } from "./site";

describe("siteRouter", () => {
  test("create should create a new site", async () => {
    // Mock the necessary dependencies and context objects
    const ctx = {
      db: {
        $transaction: jest.fn().mockResolvedValue([{ id: 1, name: "Site 1" }]),
        site: {
          create: jest.fn(),
        },
        user: {
          update: jest.fn(),
        },
      },
      session: {
        user: {
          id: 1,
        },
      },
    };

    const input = {
      name: "Site 1",
      id: 1,
      listenPort: 51820,
      private_key: "private_key",
      public_key: "public_key",
      endpointAddress: "172.16.0.1",
      localAddresses: "192.168.0.1",
      dns: "8.8.8.8",
      dns_pihole: "192.168.0.2",
      config_path: "/path/to/config",
      markAsDefault: true,
    };

    // Call the create mutation
    const createdSite = await siteRouter.create.mutation({ ctx, input });

    // Assert the expected results
    expect(ctx.db.$transaction).toHaveBeenCalledTimes(2);
    expect(ctx.db.site.create).toHaveBeenCalledWith({
      data: {
        id: input.id,
        name: input.name,
        endpointAddress: input.endpointAddress,
        DNS: input.dns,
        PiholeDNS: input.dns_pihole,
        ConfigPath: input.config_path,
        PrivateKey: input.private_key,
        PublicKey: input.public_key,
        localAddresses: input.localAddresses,
        listenPort: input.listenPort,
        postUp: undefined,
        postDown: undefined,
      },
    });
    expect(ctx.db.user.update).toHaveBeenCalledWith({
      where: { id: ctx.session.user.id },
      data: { defaultSiteId: createdSite.id },
    });
    expect(createdSite).toEqual({ id: 1, name: "Site 1" });
  });

  test("getAll should return all sites with default flag and assigned network", async () => {
    // Mock the necessary dependencies and context objects
    const ctx = {
      db: {
        site: {
          findMany: jest.fn().mockResolvedValue([
            { id: 1, name: "Site 1" },
            { id: 2, name: "Site 2" },
          ]),
        },
        settings: {
          findFirst: jest.fn().mockResolvedValue({ value: "172.16.0.0/24" }),
        },
      },
    };

    // Call the getAll query
    const sites = await siteRouter.getAll.query({ ctx });

    // Assert the expected results
    expect(ctx.db.site.findMany).toHaveBeenCalled();
    expect(ctx.db.settings.findFirst).toHaveBeenCalledWith({ where: { name: "wg_network" } });
    expect(sites).toEqual([
      {
        id: 1,
        name: "Site 1",
        isDefault: false,
        assignedNetwork: "172.16.0.1/24",
      },
      {
        id: 2,
        name: "Site 2",
        isDefault: false,
        assignedNetwork: "172.16.0.2/24",
      },
    ]);
  });

  // Add more tests for other methods in siteRouter...
});
