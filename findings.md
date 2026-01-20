# Findings: mittwald/cli Codebase

## **Summary**
During the investigation and resolution of [Issue #1589](https://github.com/mittwald/cli/issues/1589), several issues and architectural challenges in the `mittwald/cli` codebase were identified. While they are not blocking the immediate fix, they warrant attention in separate future refactoring tasks to maintain the codebase's integrity and long-term maintainability.

---

## **Findings**

### **1. Circular Imports Hindering Refactoring Efforts**
The current project structure includes circular imports between key utility and processing modules (e.g., `fs/promises` and environment-related utilities). 

These issues prevent:
- Centralizing core logic (e.g., file system operations) into single modules.
- Simplifying testing via consistent mocking of dependencies.

This makes it difficult to refactor or improve the codebase without significant structural adjustments.

### **2. Fragile Environment Variable Handling**
Handling of environment variables is fragmented across multiple functions:
  - `collectEnvironment`
  - `sanitizeStackDefinition`
  - `setEnvironmentFromEnvFile` (within `enrichStackDefinition`)

This scattering of responsibilities:
- Increases code complexity.
- Makes it harder to understand the flow of environment variable transformations.
- Adds redundancy and potential for bugs due to unclear boundaries.

### **3. Limitations of `parse` and `substituteEnvironmentVariables`**
Both `parse` (patched to address the immediate bug) and `substituteEnvironmentVariables` present specific limitations:
- Lack of support for malformed `.env` files or YAML contents.
- Inability to handle escaped variable sequences (e.g., `\${VAR}`) properly.
- No support for nested variables (e.g., `${VAR_${OTHER_VAR}}`).
- Undefined or empty values can lead to subtle runtime errors due to unclear fallback logic.

To ensure robust environment parsing and substitution, these functions must be extended and tested for edge cases.

### **4. Lack of Validation Against API Schema**
No validation is performed against the `StackRequest` structure prior to sending it to the Mittwald API. Without schema enforcement, there is a risk of runtime errors due to:
- Misaligned or missing fields after transformations like `sanitizeStackDefinition` and `enrichStackDefinition`.
- Improper assumptions about the final structure of `StackRequest`.

---

## **Proposed Refactoring Tasks**

### **1. Resolve Circular Dependencies**
Create single points of responsibility to centralize functionality and eliminate redundant or cyclic imports. For example:
- Introduce a unified file system utility module for all `fs/promises` functionality to ensure proper abstraction and testability.
- Separate environment variable parsing from other transformations (e.g., `setEnvironmentFromEnvFile`) and handle inputs in an isolated module.

---

### **2. Replace `envfile` with a More Robust Parser**
Transition from `envfile` to an actively supported library like `dotenv` or `dotenv-expand`. The new parser should:
- Preserve quotes and handle JSON strings properly.
- Provide cleaner error handling for malformed `.env` files.

---

### **3. Add Validation for `StackRequest`**
Introduce schema validation (e.g., with `ajv` or `zod`) to ensure that all transformations result in a valid structure before interacting with the Mittwald API.

---

### **4. Improve `substituteEnvironmentVariables`**
Enhance and test the `substituteEnvironmentVariables` function to ensure it handles:
- Edge cases, including escaped sequences, nested variables, and undefined or empty values.
- Complex use cases, such as recursive substitution and error-fallback scenarios.

---

### **Next Actions**
- Integrate these findings into your development workflow and create corresponding GitHub issues.
- Prioritize these refactoring tasks, balancing quick bug fixes with long-term code maintainability.

---

**End of Findings**
