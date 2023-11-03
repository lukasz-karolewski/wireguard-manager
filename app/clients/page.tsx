interface Client {
  id: string;
  name: string;
  publicKey: string;
}

interface Props {
  clients: Client[];
}

const ClientsList: React.FC<Props> = ({ clients }) => {
  return <div>{/* TODO: Render the list of clients */}</div>;
};

export default ClientsList;
