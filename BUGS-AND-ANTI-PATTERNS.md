# BUGS-AND-ANTI-PATTERNS.md

## Observed Bugs and Anti-Patterns in the Codebase

This document outlines the identified bugs and anti-patterns in the codebase, along with recommendations for refactoring. Each issue is categorized and references the affected files for clarity.

---

### 1. **Async in `forEach`**
- **Issue**: Asynchronous operations are used inside `forEach` without proper awaiting. This can lead to unexpected behavior since `forEach` does not handle promises.
- **Example**:
  - File: `utils/getLutAddressesForCandyMachineAndGuard.ts`
    ```typescript
    candyGuard.groups.forEach(async (group) => {
      if (group.guards.addressGate.__option === "Some") {
        guardKeys.push(group.guards.addressGate.value.address);
      }
    });
    ```
- **Recommendation**: Replace `forEach` with a `for...of` loop to ensure proper sequencing of asynchronous operations.
    ```typescript
    for (const group of candyGuard.groups) {
      if (group.guards.addressGate.__option === "Some") {
        guardKeys.push(group.guards.addressGate.value.address);
      }
    }
    ```

---

### 2. **PublicKey Comparison**
- **Issue**: `PublicKey` objects are compared using inequality (`!=`) instead of the `.equals` method. This can lead to incorrect comparisons since `PublicKey` objects are not directly comparable.
- **Example**:
  - File: `utils/checkerHelper.ts`
    ```typescript
    if (wallet != address) {
      return false;
    }
    ```
- **Recommendation**: Use the `.equals` method for comparing `PublicKey` objects.
    ```typescript
    if (!wallet.equals(address)) {
      return false;
    }
    ```

---

### 3. **Use of Global `UIkit`**
- **Issue**: The `UIkit` library is used as a global variable in event handlers without explicit imports or guarantees of its availability.
- **Example**:
  - File: `components/MobileMenu.js`
    ```javascript
    const offcanvas = UIkit.offcanvas("#uni_mobile_menu");
    if (offcanvas) {
      offcanvas.show();
    }
    ```
- **Recommendation**:
  - Explicitly import `UIkit` in the file or ensure it is loaded before the component renders.
  - Example:
    ```javascript
    import UIkit from "uikit";
    ```

---

### 4. **Environmental Variables and TypeScript Configuration**
- **Issue 1**: The `tsconfig.json` file has the `target` set to `es5`, which is suboptimal for modern Next.js applications.
- **Issue 2**: Environmental variables such as `NEXT_PUBLIC_CANDY_MACHINE_ID` and `NEXT_PUBLIC_MAXMINTAMOUNT` are not validated, leading to potential runtime errors.
- **Example**:
  - File: `utils/mintHelper.ts`
    ```typescript
    const maxmintamount = Number(process.env.NEXT_PUBLIC_MAXMINTAMOUNT);
    ```
- **Recommendation**:
  - Update the `tsconfig.json` target to `es6` or later.
  - Validate environment variables at runtime using a utility function or library like `dotenv` or `zod`.
    ```typescript
    if (!process.env.NEXT_PUBLIC_CANDY_MACHINE_ID) {
      throw new Error("NEXT_PUBLIC_CANDY_MACHINE_ID is not defined");
    }
    ```

---

### 5. **Toast Side Effects Inside Utility Functions**
- **Issue**: Utility functions mix business logic with UI notifications (e.g., `toast`), which violates separation of concerns.
- **Example**:
  - File: `utils/validateConfig.ts`
    ```typescript
    createStandaloneToast().toast({
      title: "Your Candy Guard config is incorrect!",
      description: `${ata} is not a Associated Token Account! Minting will fail!`,
      status: "error",
      duration: 9000,
      isClosable: false,
    });
    ```
- **Recommendation**:
  - Decouple side effects from utility functions. Return standardized errors or results that can be handled in the UI layer.
    ```typescript
    return { success: false, error: `${ata} is not a valid Associated Token Account` };
    ```

---

### Summary of Recommendations
1. Replace `forEach` with `for...of` for async operations.
2. Use `.equals` for `PublicKey` comparisons.
3. Explicitly import `UIkit` or ensure its availability globally.
4. Update `tsconfig.json` to target `es6` or later and validate environment variables.
5. Decouple UI side effects (e.g., `toast`) from utility functions.

By addressing these issues, the codebase will become more robust, maintainable, and aligned with best practices.
