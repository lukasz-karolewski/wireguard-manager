import { get_server_address } from "./common";

test("get_server_address should return correct server subnetv", () => {
  expect(get_server_address("172.16.0.0/16", 1)).toBe("172.16.1.1/16");
  expect(get_server_address("172.16.0.0/16", 10)).toBe("172.16.10.1/16");
});
