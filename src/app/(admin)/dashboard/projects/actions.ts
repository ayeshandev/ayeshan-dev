'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { projectSchema } from '@/lib/validations/project'

export async function createProject(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    techStack: formData.getAll('techStack'),
    liveUrl: formData.get('liveUrl') ?? '',
    githubUrl: formData.get('githubUrl') ?? '',
    coverImage: formData.get('coverImage') ?? undefined,
    status: formData.get('status'),
    featured: formData.get('featured') === 'true',
    sortOrder: Number(formData.get('sortOrder') ?? 0),
  }

  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { liveUrl, githubUrl, coverImage, ...rest } = parsed.data

  await prisma.project.create({
    data: {
      ...rest,
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      coverImage: coverImage || null,
      authorId: user.id,
    },
  })

  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing || existing.authorId !== user.id) {
    return { error: { _root: ['Project not found'] } }
  }

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    techStack: formData.getAll('techStack'),
    liveUrl: formData.get('liveUrl') ?? '',
    githubUrl: formData.get('githubUrl') ?? '',
    coverImage: formData.get('coverImage') ?? undefined,
    status: formData.get('status'),
    featured: formData.get('featured') === 'true',
    sortOrder: Number(formData.get('sortOrder') ?? 0),
  }

  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { liveUrl, githubUrl, coverImage, ...rest } = parsed.data

  await prisma.project.update({
    where: { id },
    data: {
      ...rest,
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      coverImage: coverImage || null,
    },
  })

  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}

export async function deleteProject(id: string) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing || existing.authorId !== user.id) return

  await prisma.project.delete({ where: { id } })

  revalidatePath('/dashboard/projects')
}
