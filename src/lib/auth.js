import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyRecaptcha } from '@/contexts/recaptcha/server';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.ECOM_GOOGLE_CLIENT_ID,
      clientSecret: process.env.ECOM_GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        recaptchaToken: { label: 'reCAPTCHA Token', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password, recaptchaToken } = credentials;

        // Verify reCAPTCHA token
        const isValidCaptcha = await verifyRecaptcha(recaptchaToken, 'login');
        if (!isValidCaptcha) {
          throw new Error('reCAPTCHA verification failed');
        }

        // Find user by email
        const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) return null;

        const user = rows[0];

        // Compare password hash
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          public_id: user.public_id,
          profile_photo: user.profile_photo || '/assets/images/avatar/defaultAvatar.png',
        };
      },
    }),
  ],

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        const email = user.email;
        const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
        const dbUser = rows[0];

        if (!dbUser) {
          // Auto-create user
          await query(
            'INSERT INTO users (email, name, role, password) VALUES ($1, $2, $3, $4)',
            [email, user.name || '', 'customer', '']
          );

          const { rows: newRows } = await query('SELECT * FROM users WHERE email = $1', [email]);
          const newUser = newRows[0];
          user.id = newUser.id;
          user.role = newUser.role;
          user.name = newUser.name;
          user.phone = newUser.phone;
          user.address = newUser.address;
          user.public_id = newUser.public_id;
          user.profile_photo = newUser.profile_photo || '/assets/images/avatar/defaultAvatar.png';
        } else {
          // Existing user
          user.id = dbUser.id;
          user.role = dbUser.role;
          user.name = dbUser.name;
          user.phone = dbUser.phone;
          user.address = dbUser.address;
          user.public_id = dbUser.public_id;
          user.profile_photo = dbUser.profile_photo || '/assets/images/avatar/defaultAvatar.png';
        }
      }

      return true; // allow sign in
    },

    async jwt({ token, user }) {
      if (user) {
        // First time login — store initial user info in token
        token.user = user;
      } else if (token?.user?.id) {
        // On subsequent calls — refresh from DB
        const { rows } = await query(
          'SELECT id, name, email, role, phone, address, public_id, profile_photo FROM users WHERE id = $1',
          [token.user.id]
        );
        const freshUser = rows[0];
        if (freshUser) {
          token.user = {
            id: freshUser.id.toString(),
            name: freshUser.name,
            email: freshUser.email,
            role: freshUser.role,
            phone: freshUser.phone,
            address: freshUser.address,
            public_id: freshUser.public_id,
            profile_photo: freshUser.profile_photo || '/assets/images/avatar/defaultAvatar.png',
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },

  secret: process.env.ECOM_NEXTAUTH_SECRET,
  url: process.env.ECOM_NEXTAUTH_URL,
};
