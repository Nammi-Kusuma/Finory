import { z } from "zod";

export const accountSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    type: z.enum(["CURRENT", "SAVINGS"]),
    balance: z.coerce.number().min(0, "Balance must be at least 0"),
    isDefault: z.boolean().default(false),
});