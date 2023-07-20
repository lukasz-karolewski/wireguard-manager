// import useSwr from "swr";
// import { GlobalConfig } from "~/types";

// import React, { ReactElement } from "react";
// type ConfigContext = {
//   config?: GlobalConfig;
// };

// const ConfigContext = React.createContext<ConfigContext>({
//   config: {
//     wg_network: "172.15.0.0/16",
//     clients: [],
//     servers: [],
//   },
// });

// type ConfigProviderProps = {};
// /**
//  * The initial value of `user` comes from the `initialUser`
//  * prop which gets set by _app. We store that value in state and ignore
//  * the prop from then on. The value can be changed by calling the
//  * `setUser()` method in the context.
//  */
// export const ConfigProvider: React.FC<React.PropsWithChildren<ConfigProviderProps>> = ({
//   children,
// }) => {
//   const [config, setConfig] = React.useState(initialConfig);

//   const value = React.useMemo(
//     () => ({
//       config,
//       setConfig,
//     }),
//     [config],
//   );

//   return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
// };

// export function useConfig() {
//   const context = React.useContext(ConfigContext);
//   if (context === undefined) {
//     throw new Error("ConfigProvider is missing");
//   }
//   return context;
// }
