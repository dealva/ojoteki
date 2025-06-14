import { getServerSession } from 'next-auth';
import { authOptions } from './auth';


export async function getSessionUser() {


  const session = await getServerSession(authOptions);
  const user = session?.user ?? null;

  return {
    isAuthenticated: !!user,
    user,
  };
}
