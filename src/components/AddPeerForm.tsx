// function AddPeerForm() {
//   const [clientId, setClientId] = useState(1);
//   const [privateKey, setPrivateKey] = useState("");
//   const [publicKey, setPublicKey] = useState("");
//   const [description, setDescription] = useState("");

//   return (
//     <>
//       <input
//         className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//         type="number"
//         min={1}
//         max={254}
//         step={1}
//         value={clientId}
//         onChange={(event) => {
//           setClientId(+event.target.value);
//         }}
//       />

//       <input
//         className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//         type="text"
//         value={privateKey}
//         readOnly
//       />

//       <input
//         className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//         type="text"
//         value={description}
//         onChange={(event) => setDescription(event.target.value)}
//       />
//     </>
//   );
// }
