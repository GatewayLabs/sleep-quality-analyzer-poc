import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { arbitrum, mainnet, optimism, polygon } from "wagmi/chains";
import { createStorage } from "wagmi";

import { gatewayChain } from "./chain";

const storage = createStorage({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

export const rainbowkitConfig = getDefaultConfig({
  appName: "Encrypted IQ",
  projectId: "7005807e3f03ced8585d802da6029645",
  chains: [gatewayChain, mainnet, polygon, arbitrum, optimism],
  ssr: false,
  storage,
});
