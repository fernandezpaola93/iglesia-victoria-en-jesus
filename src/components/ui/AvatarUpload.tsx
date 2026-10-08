'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AvatarUploadProps {
  currentUrl?: string | null
  onUploadComplete?: (url: string) => void
  userId?: string
  className?: string
}

export function AvatarUpload({ 
  currentUrl, 
  onUploadComplete, 
  userId,
  className = '' 
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar 5MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      const ext = file.name.split('.').pop()
      const fileName = `${userId || 'temp'}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('member-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('member-photos')
        .getPublicUrl(fileName)

      const publicUrl = data.publicUrl
      setPreview(publicUrl)
      onUploadComplete?.(publicUrl)
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUploadComplete?.('')
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <label className="cursor-pointer">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-primary-100 border-2 border-dashed border-primary-300 flex items-center justify-center">
          {preview ? (
            <>
              <img 
                src={preview} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
              {!uploading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  aria-label="Eliminar foto"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-primary-400 p-4">
              <Upload className="h-8 w-8" />
              <span className="text-sm font-medium">Subir foto</span>
              <span className="text-xs text-primary-300">Máx. 5MB • JPG, PNG</span>
            </div>
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600" />
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="sr-only"
          disabled={uploading}
          aria-label="Subir foto de perfil"
        />
      </label>
      
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  )
}