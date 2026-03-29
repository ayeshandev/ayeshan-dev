import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * Returns the Prisma User linked to the current Supabase Auth session.
 * Creates the Prisma User on first sign-in if it doesn't exist yet.
 * Returns null if unauthenticated.
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.upsert({
    where: { email: authUser.email },
    update: {},
    create: {
      email: authUser.email,
      name: authUser.user_metadata?.full_name ?? authUser.email.split('@')[0],
    },
  })

  return user
}
