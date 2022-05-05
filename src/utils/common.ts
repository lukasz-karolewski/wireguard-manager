export function escape_description(text: string) {
  return text.replaceAll(" ", "-");
}

export const server_subnet_to_address = (subnet: string, id: number) =>
  subnet.replace("*", "" + id);
