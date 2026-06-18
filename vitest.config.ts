import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        // run each test file in its own isolated context so mocks don't bleed
        isolate: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["backend/**/*.ts"],
            exclude: ["backend/types/**", "backend/db/**", "backend/server.ts", "backend/app.ts"]
        }
    }
});
