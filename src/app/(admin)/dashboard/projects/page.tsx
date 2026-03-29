import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteProject } from './actions'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="rounded-md bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No projects yet.</p>
      ) : (
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Featured</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Tech</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {projects.map((project) => (
                <tr key={project.id} className="bg-white dark:bg-gray-950">
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {project.featured ? 'Yes' : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {project.techStack.join(', ')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={project.id} title={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PUBLISHED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    DRAFT: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    ARCHIVED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? ''}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={async () => {
        'use server'
        await deleteProject(id)
      }}
    >
      <button
        type="submit"
        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
        onClick={(e) => {
          if (!confirm(`Delete "${title}"?`)) e.preventDefault()
        }}
      >
        Delete
      </button>
    </form>
  )
}
