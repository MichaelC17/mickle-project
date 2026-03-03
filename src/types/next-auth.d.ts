import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
    youtubeAccessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    youtubeAccessToken?: string
  }
}
