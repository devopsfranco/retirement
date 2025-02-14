import {
  FreezeTokenPayment,
  GuardSet,
  TokenPayment,
} from "@metaplex-foundation/mpl-candy-machine";
import { fetchToken } from "@metaplex-foundation/mpl-toolbox";
import { PublicKey, Some, Umi } from "@metaplex-foundation/umi";
export const checkAtaValid = (
  umi: Umi,
  guards: { label: string; guards: GuardSet }[]
) => {
  console.log("checkAtaValid");
  let atas: PublicKey[] = [];
  let invalidAtas: { ata: PublicKey; error: string }[] = [];

  guards.forEach((guard) => {
    if (guard.guards.tokenPayment.__option === "Some") {
      let tokenPayment = guard.guards.tokenPayment as Some<TokenPayment>;
      atas.push(tokenPayment.value.destinationAta);
    }
    if (guard.guards.freezeTokenPayment.__option === "Some") {
      let freezeTokenPayment = guard.guards.freezeTokenPayment as Some<FreezeTokenPayment>;
      atas.push(freezeTokenPayment.value.destinationAta);
    }
  });

  atas.forEach((ata) => {
    fetchToken(umi, ata).catch((e) => {
      invalidAtas.push({
        ata,
        error: e.message || "Unknown error",
      });
    });
  });

  return {
    success: invalidAtas.length === 0,
    invalidAtas,
  };
};

export const validateEnvVariables = () => {
  const requiredEnvVars = [
    "NEXT_PUBLIC_MICROLAMPORTS",
    "NEXT_PUBLIC_MAXMINTAMOUNT",
    "NEXT_PUBLIC_ENVIRONMENT",
    "NEXT_PUBLIC_RPC",
  ];

  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  if (isNaN(Number(process.env.NEXT_PUBLIC_MICROLAMPORTS))) {
    throw new Error(
      "NEXT_PUBLIC_MICROLAMPORTS must be a valid number."
    );
  }

  if (isNaN(Number(process.env.NEXT_PUBLIC_MAXMINTAMOUNT))) {
    throw new Error(
      "NEXT_PUBLIC_MAXMINTAMOUNT must be a valid number."
    );
  }

  if (
    !["mainnet-beta", "devnet", "testnet"].includes(
      process.env.NEXT_PUBLIC_ENVIRONMENT || ""
    )
  ) {
    throw new Error(
      "NEXT_PUBLIC_ENVIRONMENT must be one of 'mainnet-beta', 'devnet', or 'testnet'."
    );
  }

  if (!process.env.NEXT_PUBLIC_RPC.startsWith("https://")) {
    throw new Error("NEXT_PUBLIC_RPC must be a valid HTTPS URL.");
  }

  return { success: true };
};