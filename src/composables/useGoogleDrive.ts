// src/composables/useGoogleDrive.ts
import { ref } from 'vue'
import { gapi } from 'gapi-script'
import type { GoogleDriveFile, ChartData } from '@/types'

const MIME_TYPE = 'application/vnd.project-gantt'

interface DriveFileListResponse {
  result: {
    files: GoogleDriveFile[]
  }
}

interface DriveFileResponse {
  result: GoogleDriveFile
}

interface DriveFileGetResponse {
  body: string
}

export function useGoogleDrive() {
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const listFiles = async (folderId: string = 'root'): Promise<GoogleDriveFile[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, modifiedTime, iconLink)',
        orderBy: 'modifiedTime desc',
        pageSize: 100,
      }) as unknown as DriveFileListResponse

      return response.result.files
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      console.error('Error listing files:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createFile = async (
    name: string,
    content: ChartData,
    folderId: string = 'root'
  ): Promise<GoogleDriveFile> => {
    isLoading.value = true
    error.value = null

    try {
      const boundary = '-------314159265358979323846'
      const delimiter = "\r\n--" + boundary + "\r\n"
      const close_delim = "\r\n--" + boundary + "--"

      const metadata = {
        name: name,
        mimeType: MIME_TYPE,
        parents: [folderId],
      }

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + MIME_TYPE + '\r\n\r\n' +
        JSON.stringify(content) +
        close_delim

      const response = await gapi.client.request({
        path: '/upload/drive/v3/files',
        method: 'POST',
        params: { uploadType: 'multipart' },
        headers: {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"',
        },
        body: multipartRequestBody,
      }) as unknown as DriveFileResponse

      return response.result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      console.error('Error creating file:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateFile = async (fileId: string, content: ChartData): Promise<GoogleDriveFile> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await gapi.client.request({
        path: `/upload/drive/v3/files/${fileId}`,
        method: 'PATCH',
        params: { uploadType: 'media' },
        headers: {
          'Content-Type': MIME_TYPE,
        },
        body: JSON.stringify(content),
      }) as unknown as DriveFileResponse

      return response.result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      console.error('Error updating file:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const readFile = async (fileId: string): Promise<ChartData> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media',
      }) as unknown as DriveFileGetResponse

      return JSON.parse(response.body)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      console.error('Error reading file:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteFile = async (fileId: string): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      await gapi.client.drive.files.delete({
        fileId: fileId,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      console.error('Error deleting file:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createFolder = async (
    name: string,
    parentId: string = 'root'
  ): Promise<GoogleDriveFile> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await gapi.client.drive.files.create({
        resource: {
          name: name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId],
        },
        fields: 'id, name',
      }) as unknown as DriveFileResponse

      return response.result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      console.error('Error creating folder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    listFiles,
    createFile,
    updateFile,
    readFile,
    deleteFile,
    createFolder,
  }
}
