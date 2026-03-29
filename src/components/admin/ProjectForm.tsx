'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { ProjectModel } from '@/generated/prisma/models/Project'
import { slugify } from '@/lib/utils'
import { createProject, updateProject } from '@/app/(admin)/dashboard/projects/actions'

type Props = {
  project?: ProjectModel
}

export default function ProjectForm({ project }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState(project?.title ?? '')
  const [slug, setSlug] = useState(project?.slug ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [techStack, setTechStack] = useState<string[]>(project?.techStack ?? [])
  const [techInput, setTechInput] = useState('')
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? '')
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? '')
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? '')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>(
    project?.status ?? 'DRAFT'
  )
  const [featured, setFeatured] = useState(project?.featured ?? false)
  const [sortOrder, setSortOrder] = useState(project?.sortOrder ?? 0)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!project) setSlug(slugify(value))
  }

  function addTech() {
    const t = techInput.trim()
    if (t && !techStack.includes(t)) {
      setTechStack([...techStack, t])
    }
    setTechInput('')
  }

  function removeTech(tech: string) {
    setTechStack(techStack.filter((t) => t !== tech))
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (json.url) setCoverImage(json.url)
    setUploading(false)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    // Reattach dynamic arrays not tied to named inputs
    formData.delete('techStack')
    techStack.forEach((t) => formData.append('techStack', t))
    formData.set('featured', String(featured))

    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, formData)
        : await createProject(formData)

      if (result?.error) {
        setErrors(result.error as Record<string, string[]>)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Title */}
      <Field label="Title" error={errors.title}>
        <input
          name="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={input}
          required
        />
      </Field>

      {/* Slug */}
      <Field label="Slug" error={errors.slug}>
        <input
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={input}
          required
        />
      </Field>

      {/* Description */}
      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={input}
          required
        />
      </Field>

      {/* Tech Stack */}
      <Field label="Tech Stack" error={errors.techStack}>
        <div className="flex flex-wrap gap-2 mb-2">
          {techStack.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTech(t)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addTech() }
            }}
            placeholder="e.g. Next.js — press Enter to add"
            className={`${input} flex-1`}
          />
          <button type="button" onClick={addTech} className={secondaryBtn}>
            Add
          </button>
        </div>
      </Field>

      {/* Cover Image */}
      <Field label="Cover Image" error={errors.coverImage}>
        <input type="hidden" name="coverImage" value={coverImage} />
        <div className="space-y-2">
          {coverImage && (
            <img src={coverImage} alt="Cover" className="h-32 w-auto rounded-md object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file)
            }}
            className="text-sm"
          />
          {uploading && <p className="text-xs text-gray-400">Uploading…</p>}
        </div>
      </Field>

      {/* Live URL */}
      <Field label="Live URL" error={errors.liveUrl}>
        <input
          name="liveUrl"
          type="url"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          placeholder="https://"
          className={input}
        />
      </Field>

      {/* GitHub URL */}
      <Field label="GitHub URL" error={errors.githubUrl}>
        <input
          name="githubUrl"
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/..."
          className={input}
        />
      </Field>

      {/* Status + Featured + Sort Order */}
      <div className="grid grid-cols-3 gap-4">
        <Field label="Status" error={errors.status}>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className={input}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </Field>

        <Field label="Sort Order" error={errors.sortOrder}>
          <input
            name="sortOrder"
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className={input}
          />
        </Field>

        <Field label=" " error={undefined}>
          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm">Featured</span>
          </label>
        </Field>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending || uploading} className={primaryBtn}>
          {isPending ? 'Saving…' : project ? 'Save changes' : 'Create project'}
        </button>
        <button type="button" onClick={() => router.back()} className={secondaryBtn}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string[]
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {error?.map((e) => (
        <p key={e} className="mt-1 text-xs text-red-500">
          {e}
        </p>
      ))}
    </div>
  )
}

const input =
  'w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'

const primaryBtn =
  'rounded-md bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-80 disabled:opacity-40 transition-opacity'

const secondaryBtn =
  'rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
