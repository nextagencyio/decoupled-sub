import Link from 'next/link'
import Image from 'next/image'
import { Clock, Lock, Unlock } from 'lucide-react'
import type { Post } from '@/lib/types'

interface PostCardProps {
  post: Post
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (featured) {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group block bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700 hover:border-primary-500/50 transition-all hover:shadow-xl hover:shadow-primary-500/10"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-video md:aspect-auto md:h-full min-h-[250px]">
            {post.image ? (
              <Image
                src={post.image.url}
                alt={post.image.alt}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 via-purple-600/20 to-gray-800 flex items-center justify-center">
                <div className="text-primary-400/50">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
              <span>{date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
              <span className="ml-auto flex items-center gap-1 text-primary-400">
                <Lock className="h-4 w-4" />
                Premium
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-400 line-clamp-3 mb-6">
              {post.excerpt.replace(/<[^>]*>/g, '')}
            </p>
            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar.url}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span className="text-gray-300">{post.author.name}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-500/10"
    >
      <div className="relative aspect-video">
        {post.image ? (
          <Image
            src={post.image.url}
            alt={post.image.alt}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-purple-600/10 to-gray-800 flex items-center justify-center">
            <div className="text-primary-400/30">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-400 line-clamp-2 mb-4">
          {post.excerpt.replace(/<[^>]*>/g, '')}
        </p>
        <div className="flex items-center justify-between">
          {post.author && (
            <span className="text-sm text-gray-500">{post.author.name}</span>
          )}
          <span className="flex items-center gap-1 text-sm text-primary-400">
            <Lock className="h-3 w-3" />
            Premium
          </span>
        </div>
      </div>
    </Link>
  )
}
