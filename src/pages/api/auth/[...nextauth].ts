// resource: https://github.com/wpcodevo/nextauth-nextjs13-prisma/tree/main
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { AuthOptions } from "next-auth";
import { Adapter, AdapterUser } from "next-auth/adapters";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

const prisma = new PrismaClient();

function CustomPrismaAdapter(p: typeof prisma): Adapter {
	// @ts-ignore
	return {
		...PrismaAdapter(p),
		async createUser(user: Omit<AdapterUser, "id">) {
			const result = await p.$transaction(async (trx) => {
				const created = await trx.user.create({
					data: {
						image: user.image,
						role: user.role,
						emailVerified: user.emailVerified,
						name: user.name,
						email: user.email,
					},
				});

				return created;
			});

			return result as AdapterUser;
		},
	};
}

export const authOptions: AuthOptions = {
	secret: process.env.NEXTAUTH_SECRET!,
	adapter: CustomPrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
			profile: (profile) => {
				return {
					id: profile.sub,
					name: profile.name,
					firstname: profile.given_name,
					lastname: profile.family_name,
					email: profile.email,
					image: profile.picture,
					role: profile.role ?? "student",
				};
			},
		}),
	],

	debug: process.env.NODE_ENV === "development",
	session: {
		strategy: "jwt",
	},
	callbacks: {
		signIn: async ({ account, profile }) => {
			if (account?.provider === "google") {
				// @ts-ignore
				const googleProfile = profile as GoogleProfile;
				return googleProfile?.email_verified;
			}
			return true;
		},
		jwt: async ({ token, user, trigger, session }) => {
			if (user) {
				token.role = user.role;
				token.id = user.id;
			}

			if (trigger === "update" && session?.user?.name) {
				token.name = session.user.name;
			}

			return token;
		},
		session({ session, token }) {
			session.user.id = token.id;
			session.user.role = token.role;
			return session;
		},
	},
};

export default NextAuth(authOptions);
