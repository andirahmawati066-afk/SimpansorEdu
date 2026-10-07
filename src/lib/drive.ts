export interface DriveUser {
  displayName?: string;
  emailAddress?: string;
  photoLink?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  owners?: DriveUser[];
  shared?: boolean;
  fileExtension?: string;
  hasThumbnail?: boolean;
  description?: string;
}

export interface FolderMetadata {
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  createdTime?: string;
  modifiedTime?: string;
  owners?: DriveUser[];
  webViewLink?: string;
  parents?: string[];
}

export interface FolderListResult {
  folder: FolderMetadata | null;
  files: DriveFile[];
  nextPageToken?: string;
}

/**
 * Extracts folder ID from Google Drive URL or raw ID
 */
export function extractFolderId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // If it's a URL like https://drive.google.com/drive/folders/ABC123xyz...
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  // If it's a URL like https://drive.google.com/open?id=ABC123xyz
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }

  // If it's already an ID
  if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed) || trimmed === 'root') {
    return trimmed;
  }

  return trimmed;
}

/**
 * Formats bytes to human-readable size
 */
export function formatFileSize(bytesStr?: string): string {
  if (!bytesStr) return '-';
  const bytes = parseInt(bytesStr, 10);
  if (isNaN(bytes)) return '-';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Helper to identify file type categories
 */
export function getFileTypeCategory(mimeType: string): {
  type: 'folder' | 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'other';
  label: string;
  badgeColor: string;
} {
  if (mimeType === 'application/vnd.google-apps.folder') {
    return { type: 'folder', label: 'Folder', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' };
  }
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return { type: 'presentation', label: 'Presentasi / Slide', badgeColor: 'bg-orange-100 text-orange-800 border-orange-200' };
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
    return { type: 'spreadsheet', label: 'Spreadsheet / Excel', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  }
  if (mimeType.includes('document') || mimeType.includes('word')) {
    return { type: 'document', label: 'Dokumen / Word', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' };
  }
  if (mimeType.includes('pdf')) {
    return { type: 'pdf', label: 'PDF Document', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200' };
  }
  if (mimeType.startsWith('image/')) {
    return { type: 'image', label: 'Gambar / Foto', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' };
  }
  if (mimeType.startsWith('video/')) {
    return { type: 'video', label: 'Video', badgeColor: 'bg-red-100 text-red-800 border-red-200' };
  }
  if (mimeType.startsWith('audio/')) {
    return { type: 'audio', label: 'Audio', badgeColor: 'bg-violet-100 text-violet-800 border-violet-200' };
  }
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed') || mimeType.includes('tar')) {
    return { type: 'archive', label: 'Arsip / Zip', badgeColor: 'bg-slate-100 text-slate-800 border-slate-200' };
  }
  if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html') || mimeType.includes('text/x-')) {
    return { type: 'code', label: 'Kode / Script', badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
  }
  return { type: 'other', label: 'Berkas', badgeColor: 'bg-gray-100 text-gray-800 border-gray-200' };
}

// Known public folder data for default demo / offline inspection
export const KNOWN_PUBLIC_FOLDERS: Record<string, { folder: FolderMetadata; files: DriveFile[] }> = {
  '1eTvzk2W0wmT2SSWK7hlqzk6PhbjkOVqp': {
    folder: {
      id: '1eTvzk2W0wmT2SSWK7hlqzk6PhbjkOVqp',
      name: 'WEB RAHMA',
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Folder Google Drive berisi proyek web aplikasi edukasi pembelajaran (studio-app)',
      createdTime: '2026-03-24T00:00:00.000Z',
      modifiedTime: '2026-03-24T00:00:00.000Z',
      owners: [{
        displayName: 'Andi Marauleng',
        emailAddress: 'andimarauleng13@guru.smp.belajar.id'
      }],
      webViewLink: 'https://drive.google.com/drive/folders/1eTvzk2W0wmT2SSWK7hlqzk6PhbjkOVqp'
    },
    files: [
      {
        id: '19BBLQpekRHSXYyBbJRprNxS6YFi_OA3f',
        name: 'studio-app',
        mimeType: 'application/vnd.google-apps.folder',
        webViewLink: 'https://drive.google.com/drive/folders/19BBLQpekRHSXYyBbJRprNxS6YFi_OA3f',
        description: 'Proyek aplikasi web AI Studio: Media Pembelajaran Interaktif Sensor & Kuis IPA/Informatika SMP',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      }
    ]
  },
  '19BBLQpekRHSXYyBbJRprNxS6YFi_OA3f': {
    folder: {
      id: '19BBLQpekRHSXYyBbJRprNxS6YFi_OA3f',
      name: 'studio-app',
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Source code aplikasi web pembelajaran interaktif modul sensor & kuis',
      createdTime: '2026-03-24T07:40:00.000Z',
      modifiedTime: '2026-03-24T07:43:00.000Z',
      owners: [{
        displayName: 'Andi Marauleng',
        emailAddress: 'andimarauleng13@guru.smp.belajar.id'
      }],
      webViewLink: 'https://drive.google.com/drive/folders/19BBLQpekRHSXYyBbJRprNxS6YFi_OA3f'
    },
    files: [
      {
        id: '1LcrgL_2WjIr6Tyu_UY9kqPAZQBHl1BQu',
        name: 'src',
        mimeType: 'application/vnd.google-apps.folder',
        webViewLink: 'https://drive.google.com/drive/folders/1LcrgL_2WjIr6Tyu_UY9kqPAZQBHl1BQu',
        description: 'Folder kode sumber React (components, data, types, utils, App.tsx)',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1sUFyRoGScQm0qFDzcu7L-uwKFl88umt0',
        name: 'README.md',
        mimeType: 'text/markdown',
        size: '568',
        webViewLink: 'https://drive.google.com/file/d/1sUFyRoGScQm0qFDzcu7L-uwKFl88umt0/view',
        webContentLink: 'https://drive.google.com/uc?export=download&id=1sUFyRoGScQm0qFDzcu7L-uwKFl88umt0',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1aMUrgEZW9XNvBjvGQ-2Kq8K6GddcZUh0',
        name: 'metadata.json',
        mimeType: 'application/json',
        size: '185',
        webViewLink: 'https://drive.google.com/file/d/1aMUrgEZW9XNvBjvGQ-2Kq8K6GddcZUh0/view',
        webContentLink: 'https://drive.google.com/uc?export=download&id=1aMUrgEZW9XNvBjvGQ-2Kq8K6GddcZUh0',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1Drfw4gEStPXU2OR4GMAGY3cHe70paPUg',
        name: 'package.json',
        mimeType: 'application/json',
        size: '640',
        webViewLink: 'https://drive.google.com/file/d/1Drfw4gEStPXU2OR4GMAGY3cHe70paPUg/view',
        webContentLink: 'https://drive.google.com/uc?export=download&id=1Drfw4gEStPXU2OR4GMAGY3cHe70paPUg',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1IdACQmTsH5Bf1cBMqnP1N6s6znNUW6TH',
        name: 'index.html',
        mimeType: 'text/html',
        size: '720',
        webViewLink: 'https://drive.google.com/file/d/1IdACQmTsH5Bf1cBMqnP1N6s6znNUW6TH/view',
        webContentLink: 'https://drive.google.com/uc?export=download&id=1IdACQmTsH5Bf1cBMqnP1N6s6znNUW6TH',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1yZczAsw8zWZQFSVRmNp6wIZGtRkKtx2F',
        name: 'vite.config.ts',
        mimeType: 'application/typescript',
        size: '520',
        webViewLink: 'https://drive.google.com/file/d/1yZczAsw8zWZQFSVRmNp6wIZGtRkKtx2F/view',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1fUZ45yhlfo1FfOWmSsQxd1m6im87-ZT9',
        name: 'tsconfig.json',
        mimeType: 'application/json',
        size: '480',
        webViewLink: 'https://drive.google.com/file/d/1fUZ45yhlfo1FfOWmSsQxd1m6im87-ZT9/view',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1S2LThxeXKLyWcG8TG2JB2T3ENIWDw00H',
        name: '.env.example',
        mimeType: 'text/plain',
        size: '120',
        webViewLink: 'https://drive.google.com/file/d/1S2LThxeXKLyWcG8TG2JB2T3ENIWDw00H/view',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1-FMWD763_tlbJRPoZAXasMgaVlP07X7w',
        name: '.gitignore',
        mimeType: 'text/plain',
        size: '240',
        webViewLink: 'https://drive.google.com/file/d/1-FMWD763_tlbJRPoZAXasMgaVlP07X7w/view',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      }
    ]
  },
  '1LcrgL_2WjIr6Tyu_UY9kqPAZQBHl1BQu': {
    folder: {
      id: '1LcrgL_2WjIr6Tyu_UY9kqPAZQBHl1BQu',
      name: 'src',
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Folder kode utama aplikasi (React / Vite)',
      modifiedTime: '2026-03-24T07:43:00.000Z',
      webViewLink: 'https://drive.google.com/drive/folders/1LcrgL_2WjIr6Tyu_UY9kqPAZQBHl1BQu'
    },
    files: [
      {
        id: '17sFuSsnrzz4WBsrH36n8ZRO_5OCa9wat',
        name: 'components',
        mimeType: 'application/vnd.google-apps.folder',
        webViewLink: 'https://drive.google.com/drive/folders/17sFuSsnrzz4WBsrH36n8ZRO_5OCa9wat',
        description: 'Komponen UI (Navbar, SensorCatalog, Quiz, AdminDashboard, dll)',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1idrf-oESx9bVKKLLyKXuzIu-asQyj5ap',
        name: 'data',
        mimeType: 'application/vnd.google-apps.folder',
        webViewLink: 'https://drive.google.com/drive/folders/1idrf-oESx9bVKKLLyKXuzIu-asQyj5ap',
        description: 'Data modul sensor & bank soal kuis',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1NvKO3APZvr7WTAgSQWtFjHJDDpUAoMAd',
        name: 'types',
        mimeType: 'application/vnd.google-apps.folder',
        webViewLink: 'https://drive.google.com/drive/folders/1NvKO3APZvr7WTAgSQWtFjHJDDpUAoMAd',
        description: 'TypeScript interface dan types',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1xLSmZacE2xFw-k0oneLPLl7u2GwbVcLv',
        name: 'utils',
        mimeType: 'application/vnd.google-apps.folder',
        webViewLink: 'https://drive.google.com/drive/folders/1xLSmZacE2xFw-k0oneLPLl7u2GwbVcLv',
        description: 'Utility helper (storage, audio sound effect)',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1SVrXYPFWdga41Z-Whki599fCqQE6lxHV',
        name: 'App.tsx',
        mimeType: 'application/typescript',
        size: '12400',
        webViewLink: 'https://drive.google.com/file/d/1SVrXYPFWdga41Z-Whki599fCqQE6lxHV/view',
        webContentLink: 'https://drive.google.com/uc?export=download&id=1SVrXYPFWdga41Z-Whki599fCqQE6lxHV',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1HhyL2gniCIlukGMZWjxeVmVZgjR8MS0M',
        name: 'main.tsx',
        mimeType: 'application/typescript',
        size: '420',
        webViewLink: 'https://drive.google.com/file/d/1HhyL2gniCIlukGMZWjxeVmVZgjR8MS0M/view',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      },
      {
        id: '1Kbn--Kcx61XlCnWXmnCcc-h3wSzhp2Gw',
        name: 'index.css',
        mimeType: 'text/css',
        size: '2800',
        webViewLink: 'https://drive.google.com/file/d/1Kbn--Kcx61XlCnWXmnCcc-h3wSzhp2Gw/view',
        modifiedTime: '2026-03-24T07:43:00.000Z'
      }
    ]
  }
};

/**
 * Fetch folder metadata
 */
export async function getFolderMetadata(folderId: string, accessToken?: string | null): Promise<FolderMetadata> {
  // Check known public cache first if no accessToken
  if (!accessToken && KNOWN_PUBLIC_FOLDERS[folderId]) {
    return KNOWN_PUBLIC_FOLDERS[folderId].folder;
  }

  const isRoot = folderId === 'root';
  const url = isRoot
    ? 'https://www.googleapis.com/drive/v3/files/root?fields=id,name,mimeType,webViewLink&supportsAllDrives=true'
    : `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(folderId)}?fields=id,name,mimeType,description,createdTime,modifiedTime,owners,webViewLink,parents&supportsAllDrives=true`;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    if (KNOWN_PUBLIC_FOLDERS[folderId]) {
      return KNOWN_PUBLIC_FOLDERS[folderId].folder;
    }
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
    if (res.status === 404) {
      throw new Error(`Folder tidak ditemukan (404). Pastikan ID folder benar dan folder belum dihapus.`);
    } else if (res.status === 403) {
      throw new Error(`Akses ditolak (403 Permission Denied). Akun Google yang sedang masuk tidak memiliki hak akses untuk membuka folder ini. Hubungi pemilik tautan untuk membagikan akses folder atau ubah izin berbagi ke "Siapa saja yang memiliki link".`);
    } else if (res.status === 401) {
      throw new Error(`Sesi akses kedaluwarsa (401). Silakan klik tombol Masuk kembali.`);
    }
    throw new Error(message);
  }

  return await res.json();
}

/**
 * List files inside a specific folder
 */
export async function listFolderFiles(
  folderId: string,
  accessToken?: string | null,
  options?: {
    searchQuery?: string;
    mimeTypeFilter?: string;
    pageToken?: string;
  }
): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
  // If no accessToken and we have known public cache, serve from cache
  if (!accessToken && KNOWN_PUBLIC_FOLDERS[folderId]) {
    return { files: KNOWN_PUBLIC_FOLDERS[folderId].files };
  }

  const queryParts = [`'${folderId}' in parents`, `trashed = false`];

  if (options?.searchQuery && options.searchQuery.trim()) {
    const sanitized = options.searchQuery.replace(/'/g, "\\'");
    queryParts.push(`name contains '${sanitized}'`);
  }

  if (options?.mimeTypeFilter) {
    if (options.mimeTypeFilter === 'folder') {
      queryParts.push(`mimeType = 'application/vnd.google-apps.folder'`);
    } else if (options.mimeTypeFilter === 'document') {
      queryParts.push(`(mimeType contains 'document' or mimeType contains 'word')`);
    } else if (options.mimeTypeFilter === 'spreadsheet') {
      queryParts.push(`(mimeType contains 'spreadsheet' or mimeType contains 'excel' or mimeType contains 'csv')`);
    } else if (options.mimeTypeFilter === 'presentation') {
      queryParts.push(`(mimeType contains 'presentation' or mimeType contains 'powerpoint')`);
    } else if (options.mimeTypeFilter === 'pdf') {
      queryParts.push(`mimeType = 'application/pdf'`);
    } else if (options.mimeTypeFilter === 'image') {
      queryParts.push(`mimeType contains 'image/'`);
    }
  }

  const q = queryParts.join(' and ');
  const params = new URLSearchParams({
    q,
    fields: 'nextPageToken,files(id,name,mimeType,size,iconLink,thumbnailLink,webViewLink,webContentLink,createdTime,modifiedTime,owners,shared,fileExtension,hasThumbnail,description)',
    orderBy: 'folder,name',
    pageSize: '100',
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  });

  if (options?.pageToken) {
    params.set('pageToken', options.pageToken);
  }

  const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    if (KNOWN_PUBLIC_FOLDERS[folderId]) {
      return { files: KNOWN_PUBLIC_FOLDERS[folderId].files };
    }
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
    if (res.status === 403) {
      throw new Error(`Tidak dapat membaca daftar berkas di folder ini (403 Forbidden). Folder ini mungkin dibatasi untuk anggota domain tertentu atau akun Anda belum diundang.`);
    }
    throw new Error(message);
  }

  const data = await res.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken,
  };
}
