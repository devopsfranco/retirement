# BUGS-AND-ANTI-PATTERNS.md

## Observed Bugs and Anti-Patterns in the Codebase

This document outlines the identified bugs and anti-patterns in the codebase, along with recommendations for refactoring. Each issue is categorized and references the affected files for clarity.

---

### 1. **Async in `forEach`**
- **Issue**: Asynchronous operations are used inside `forEach` without proper awaiting. This can lead to unexpected behavior since `forEach` does not handle promises.
- **Fix Applied**: Replaced `async forEach` with `for...of` loops to ensure proper sequencing of asynchronous operations.
- **Example**:
  - File: `utils/createLutForCandyGuard.ts`
    ```typescript
    for (const group of candyGuard.groups) {
      if (group.guards.addressGate.__option === "Some") {
        guardKeys.push(group.guards.addressGate.value.address);
      }
    }
    ```
- **Symbolic Reasoning**: This change ensures that asynchronous operations are executed in sequence, preventing potential race conditions and improving code reliability.
    ```

---

### 2. **PublicKey Comparison**
- **Issue**: `PublicKey` objects were previously compared using inequality (`!=`) instead of the `.equals` method. This could lead to incorrect comparisons since `PublicKey` objects are not directly comparable.
- **Fix Applied**: Updated all `PublicKey` comparisons to use the `.equals()` method.
- **Example**:
  - File: `utils/checkerHelper.ts`
    ```typescript
    if (!wallet.equals(address)) {
      return false;
    }
    ```
- **Symbolic Reasoning**: Using `.equals()` ensures accurate comparisons of `PublicKey` objects, reducing subtle bugs and aligning with best practices for Solana development.
    ```

---

### 3. **Use of Global `UIkit`**
- **Issue**: The `UIkit` library is used as a global variable in event handlers without explicit imports or guarantees of its availability.
- **Example**:
  - File: `components/MobileMenu.js`
    ```javascript
    import UIkit from "uikit";

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
    let maxmintamount = 0;
    try {
      maxmintamount = Number(process.env.NEXT_PUBLIC_MAXMINTAMOUNT);
    } catch (e) {
      console.error('process.env.NEXT_PUBLIC_MAXMINTAMOUNT is not a number!', e);
    }
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
    return { success: false, error: `${ata} is not a valid Associated Token Account` };
    ```
- **Recommendation**:
  - Decouple side effects from utility functions. Return standardized errors or results that can be handled in the UI layer.
    ```typescript
    return { success: false, error: `${ata} is not a valid Associated Token Account` };
    ```

---

### Summary of Recommendations and Fixes
1. Replace `forEach` with `for...of` for async operations. **(Fix Applied)**: See `utils/createLutForCandyGuard.ts`.
2. Use `.equals` for `PublicKey` comparisons. **(Fix Applied)**: See `utils/checkerHelper.ts`.
3. Explicitly import `UIkit` or ensure its availability globally.
4. Update `tsconfig.json` to target `es6` or later and validate environment variables.
5. Decouple UI side effects (e.g., `toast`) from utility functions.

By addressing these issues, the codebase will become more robust, maintainable, and aligned with best practices.