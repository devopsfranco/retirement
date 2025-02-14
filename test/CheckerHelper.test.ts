import { addressGateChecker, allocationChecker, mintLimitChecker, calculateMintable } from "../utils/checkerHelper";
import { PublicKey, Umi } from "@metaplex-foundation/umi";
import { CandyMachine } from "@metaplex-foundation/mpl-candy-machine";

describe("CheckerHelper Unit Tests", () => {
  describe("addressGateChecker", () => {
    it("should return true when wallet matches the required address", () => {
      const wallet = new PublicKey("11111111111111111111111111111111");
      const requiredAddress = new PublicKey("11111111111111111111111111111111");
      expect(addressGateChecker(wallet, requiredAddress)).toBe(true);
    });

    it("should return false when wallet does not match the required address", () => {
      const wallet = new PublicKey("11111111111111111111111111111111");
      const requiredAddress = new PublicKey("22222222222222222222222222222222");
      expect(addressGateChecker(wallet, requiredAddress)).toBe(false);
    });
  });

  describe("allocationChecker", () => {
    it("should return the remaining allocation when allocation tracker exists", async () => {
      const umi = {
        rpc: {
          getAccount: jest.fn(),
        },
      } as unknown as Umi;

      const candyMachine = {
        publicKey: new PublicKey("11111111111111111111111111111111"),
        mintAuthority: new PublicKey("22222222222222222222222222222222"),
      } as unknown as CandyMachine;

      const guard = {
        label: "testGuard",
        guards: {
          allocation: {
            __option: "Some",
            value: { id: 1, limit: 10 },
          },
        },
      };

      umi.rpc.getAccount.mockResolvedValueOnce({ count: 5 });
      const result = await allocationChecker(umi, candyMachine, guard);
      expect(result).toBe(5);
    });

    it("should return 0 when allocation tracker does not exist", async () => {
      const umi = {
        rpc: {
          getAccount: jest.fn(),
        },
      } as unknown as Umi;

      const candyMachine = {
        publicKey: new PublicKey("11111111111111111111111111111111"),
        mintAuthority: new PublicKey("22222222222222222222222222222222"),
      } as unknown as CandyMachine;

      const guard = {
        label: "testGuard",
        guards: {
          allocation: {
            __option: "Some",
            value: { id: 1, limit: 10 },
          },
        },
      };

      umi.rpc.getAccount.mockResolvedValueOnce(null);
      const result = await allocationChecker(umi, candyMachine, guard);
      expect(result).toBe(0);
    });
  });

  describe("mintLimitChecker", () => {
    it("should return the remaining mint limit when mint counter exists", async () => {
      const umi = {
        rpc: {
          getAccount: jest.fn(),
        },
      } as unknown as Umi;

      const candyMachine = {
        publicKey: new PublicKey("11111111111111111111111111111111"),
        mintAuthority: new PublicKey("22222222222222222222222222222222"),
      } as unknown as CandyMachine;

      const guard = {
        label: "testGuard",
        guards: {
          mintLimit: {
            __option: "Some",
            value: { id: 1, limit: 5 },
          },
        },
      };

      umi.rpc.getAccount.mockResolvedValueOnce({ count: 2 });
      const result = await mintLimitChecker(umi, candyMachine, guard);
      expect(result).toBe(3);
    });

    it("should return the full limit when mint counter does not exist", async () => {
      const umi = {
        rpc: {
          getAccount: jest.fn(),
        },
      } as unknown as Umi;

      const candyMachine = {
        publicKey: new PublicKey("11111111111111111111111111111111"),
        mintAuthority: new PublicKey("22222222222222222222222222222222"),
      } as unknown as CandyMachine;

      const guard = {
        label: "testGuard",
        guards: {
          mintLimit: {
            __option: "Some",
            value: { id: 1, limit: 5 },
          },
        },
      };

      umi.rpc.getAccount.mockResolvedValueOnce(null);
      const result = await mintLimitChecker(umi, candyMachine, guard);
      expect(result).toBe(5);
    });
  });

  describe("calculateMintable", () => {
    it("should return the smaller of the two amounts", () => {
      expect(calculateMintable(10, 5)).toBe(5);
      expect(calculateMintable(5, 10)).toBe(5);
    });

    it("should respect the max mint amount from environment variables", () => {
      process.env.NEXT_PUBLIC_MAXMINTAMOUNT = "3";
      expect(calculateMintable(10, 5)).toBe(3);
      delete process.env.NEXT_PUBLIC_MAXMINTAMOUNT;
    });

    it("should return the original amount if no max mint amount is set", () => {
      expect(calculateMintable(10, 5)).toBe(5);
    });
  });
});
