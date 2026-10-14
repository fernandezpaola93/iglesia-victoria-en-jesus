'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Upload, X, Film, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface VideoUploadProps {
  currentUrl?: string | null
  onUploadComplete?: (url: string) => void
  sermonId?: string
  className?: string
  accept?: string
  maxSizeMB?: number
}

export function VideoUpload({ 
  currentUrl, 
  onUploadComplete, 
  sermonId,
  className = '',
  accept = 'video/*,audio/*',
  maxSizeMB = 500
}: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac']
    if (!allowedTypes.includes(file.type)) {
      setError('El archivo debe ser un video (MP4, WebM, OGG, MOV) o audio (MP3, WAV, OGG, AAC)')
      return
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo no debe superar ${maxSizeMB}MB`)
      return
    }

    setError('')
    setUploading(true)
    setProgress(0)

    try {
      const ext = file.name.split('.').pop()
      const fileName = `${sermonId || 'temp'}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('sermons')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('sermons')
        .getPublicUrl(fileName)

      const publicUrl = data.publicUrl
      setPreview(publicUrl)
      onUploadComplete?.(publicUrl)
      setProgress(100)
    } catch (err: any) {
      setError(err.message || 'Error al subir archivo')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUploadComplete?.('')
    setProgress(0)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <label className="cursor-pointer block">
        <div className="relative w-full max-w-md aspect-video min-h-[180px] rounded-xl overflow-hidden bg-primary-100 border-2 border-dashed border-primary-300 flex items-center justify-center">
          {preview ? (
            <>
              {preview.match(/\.(mp4|webm|ogg|mov|m4v)$/i) ? (
                <video 
                  src={preview} 
                  controls 
                  className="w-full h-full object-contain"
                />
              ) : (
                <audio 
                  src={preview} 
                  controls 
                  className="w-full h-full"
                />
              )}
              {!uploading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                  aria-label="Eliminar archivo"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-primary-400 p-6 text-center">
              <Film className="h-12 w-12" />
              <span className="text-base font-medium">Subir video o audio</span>
              <span className="text-sm text-primary-300">Máx. {maxSizeMB}MB • MP4, WebM, MOV, MP3, WAV</span>
            </div>
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-xl gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600" />
              <div className="text-white font-medium">Subiendo... {progress}%</div>
              <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-400 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="sr-only"
          disabled={uploading}
          aria-label="Subir video o audio"
        />
      </label>
      
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>
      )}
      
      {preview && !uploading && (
        <p className="mt-2 text-sm text-primary-600">
          Archivo seleccionado • <button type="button" onClick={handleRemove} className="underline hover:text-primary-800">Cambiar</button>
        </p>
      )}
    </div>
  )
}