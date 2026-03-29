'use client'

import { useTransition } from 'react'
import { deleteProject } from '@/app/(admin)/dashboard/projects/actions'

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(`Delete "${title}"?`)) return
    startTransition(() => deleteProject(id))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 disabled:opacity-40"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
