import GoogleProvider from "next-auth/providers/google";
import { Account, User as AuthUser } from "next-auth";
import { connect } from '@/libs/mongodb';
import Users from "@/models/Users";

export const options: any = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if(account?.provider == "google"){
        await connect();
        try {
          const existingUser = await Users.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new Users({
              email: user.email,
              image: user.image,
              role: "user",
            });
            await newUser.save();
            return true
          }

          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }
    },
  },
}