import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const apk = await readFile(join(process.cwd(), 'public', 'app-release.apk'))

  return new Response(new Uint8Array(apk), {
    headers: {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename="victoria-en-jesus.apk"',
      'Content-Length': String(apk.byteLength),
      'Cache-Control': 'no-store',
    },
  })
}
