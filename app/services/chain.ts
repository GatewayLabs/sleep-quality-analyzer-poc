import { defineChain } from "viem";

export const gatewayChain = defineChain({
  id: 678746,
  name: "Gateway Shield Testnet",
  testnet: true,
  nativeCurrency: { name: "Gateway", symbol: "OWN", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://gateway-shield-testnet.rpc.caldera.xyz/http"],
      webSocket: ["wss://gateway-shield-testnet.rpc.caldera.xyz/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://gateway-shield-testnet.explorer.caldera.xyz",
    },
  },
  contracts: {},
});
