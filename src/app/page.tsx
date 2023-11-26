"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClientListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const searchParams = new URLSearchParams();
  // const filter = searchParams.get("filter") ?? "";

  // const filteredClients = config?.clients?.filter((client) =>
  //   client.name.toLowerCase().includes(filter.toLowerCase()),
  // );

  return <div>hello</div>;
}

//       <div className="mb-4 flex justify-end">
//         <Button onClick={() => NiceModal.show(AddClientModal)}>Add Client</Button>
//       </div>

//       <div className="mb-4">{SearchBox(filter, setFilter)}</div>

//       <div className="grid grid-cols-4 gap-4">
//         {filteredClients?.map((client) => {
//           return (
//             <Link key={client.name} href={`clients/${client.id}`}>
//               <ClientItem client={client} />
//             </Link>
//           );
//         })}
//       </div>
// function SearchBox(filter: string, setFilter) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     // Focus on the input element when the component mounts
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   return (
//     <input
//       type="text"
//       placeholder="Filter by name"
//       value={filter}
//       onChange={(e) => setFilter(e.target.value)}
//       className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 sm:text-sm"
//       ref={inputRef}
//     />
//   );
// }
