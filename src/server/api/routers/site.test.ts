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
      config_path: "/path/to/config",
      dns: "8.8.8.8",
      dns_pihole: "192.168.0.2",
      endpointAddress: "172.16.0.1",
      id: 1,
      listenPort: 51_820,
      localAddresses: "192.168.0.1",
      markAsDefault: true,
      name: "Site 1",
      private_key: "private_key",
      public_key: "public_key",
    };

    // Call the create mutation
    const createdSite = await siteRouter.create.mutation({ ctx, input });

    // Assert the expected results
    expect(ctx.db.$transaction).toHaveBeenCalledTimes(2);
    expect(ctx.db.site.create).toHaveBeenCalledWith({
      data: {
        ConfigPath: input.config_path,
        DNS: input.dns,
        endpointAddress: input.endpointAddress,
        id: input.id,
        listenPort: input.listenPort,
        localAddresses: input.localAddresses,
        name: input.name,
        PiholeDNS: input.dns_pihole,
        postDown: undefined,
        postUp: undefined,
        PrivateKey: input.private_key,
        PublicKey: input.public_key,
      },
    });
    expect(ctx.db.user.update).toHaveBeenCalledWith({
      data: { defaultSiteId: createdSite.id },
      where: { id: ctx.session.user.id },
    });
    expect(createdSite).toEqual({ id: 1, name: "Site 1" });
  });

  test("getAll should return all sites with default flag and assigned network", async () => {
    // Mock the necessary dependencies and context objects
    const ctx = {
      db: {
        settings: {
          findFirst: jest.fn().mockResolvedValue({ value: "172.16.0.0/24" }),
        },
        site: {
          findMany: jest.fn().mockResolvedValue([
            { id: 1, name: "Site 1" },
            { id: 2, name: "Site 2" },
          ]),
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
        assignedNetwork: "172.16.0.1/24",
        id: 1,
        isDefault: false,
        name: "Site 1",
      },
      {
        assignedNetwork: "172.16.0.2/24",
        id: 2,
        isDefault: false,
        name: "Site 2",
      },
    ]);
  });

  // Add more tests for other methods in siteRouter...
});
