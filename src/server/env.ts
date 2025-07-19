// @ts-check
/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
import { z } from "zod";

/*eslint sort-keys: "error"*/
const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.enum(["development", "test", "production"]),
});

const envReturn = envSchema.safeParse(process.env);

if (!envReturn.success) {
	throw new Error(
		"❌ Invalid environment variables: " +
			JSON.stringify(envReturn.error.format(), null, 4),
	);
}

const env = envReturn.data;

export { env };
