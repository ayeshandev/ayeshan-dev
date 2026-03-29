import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProjectForm from '@/components/admin/ProjectForm'
import type { ProjectModel } from '@/generated/prisma/models/Project'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id } })

  if (!project) notFound()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <ProjectForm project={project as ProjectModel} />
    </div>
  )
}
