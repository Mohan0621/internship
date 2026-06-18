/**
 * Manual mock for the Prisma singleton.
 * Each model method is a vi.fn() so tests can set return values with
 * mockResolvedValue / mockRejectedValue without touching the real DB.
 */
import { vi } from "vitest";

const prismaMock = {
    team: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    teamMember: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
    },
    student: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
    judge: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
};

export default prismaMock;
