import { generateCIDR } from "./common";

test("generateCIDR should place site and device ids in the last two octets", () => {
  expect(generateCIDR("172.16.0.0/16", 1, 1)).toBe("172.16.1.1/16");
  expect(generateCIDR("172.16.0.0/16", 10, 5)).toBe("172.16.10.5/16");
});

test("generateCIDR should apply mask override", () => {
  expect(generateCIDR("172.16.0.0/16", 2, 0, "24")).toBe("172.16.2.0/24");
  expect(generateCIDR("172.16.0.0/16", 2, 7, "32")).toBe("172.16.2.7/32");
});
