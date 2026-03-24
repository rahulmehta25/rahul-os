import { create } from 'zustand';

export interface FSFile {
  type: 'file';
  name: string;
  content: string;
  createdAt: number;
  modifiedAt: number;
  icon?: string;
  opensWith?: string;
  externalUrl?: string;
}

export interface FSDirectory {
  type: 'directory';
  name: string;
  children: Record<string, FSNode>;
  createdAt: number;
}

export type FSNode = FSFile | FSDirectory;

interface FilesystemStore {
  root: FSDirectory;

  resolvePath: (path: string, cwd: string) => string;
  getNode: (path: string) => FSNode | null;
  listDirectory: (path: string) => FSNode[] | null;
  createFile: (path: string, content?: string) => boolean;
  createDirectory: (path: string) => boolean;
  deleteNode: (path: string) => boolean;
  renameNode: (oldPath: string, newName: string) => boolean;
  updateFileContent: (path: string, content: string) => boolean;
}

function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  return '/' + resolved.join('/');
}

function getNodeAtPath(root: FSDirectory, absPath: string): FSNode | null {
  if (absPath === '/') return root;
  const parts = absPath.split('/').filter(Boolean);
  let current: FSNode = root;
  for (const part of parts) {
    if (current.type !== 'directory') return null;
    const child: FSNode | undefined = current.children[part];
    if (!child) return null;
    current = child;
  }
  return current;
}

function getParentAndName(absPath: string): { parentPath: string; name: string } | null {
  if (absPath === '/') return null;
  const parts = absPath.split('/').filter(Boolean);
  const name = parts.pop()!;
  const parentPath = '/' + parts.join('/');
  return { parentPath: parentPath || '/', name };
}

function cloneNode(node: FSNode): FSNode {
  if (node.type === 'file') {
    return { ...node };
  }
  const children: Record<string, FSNode> = {};
  for (const [k, v] of Object.entries(node.children)) {
    children[k] = cloneNode(v);
  }
  return { ...node, children };
}

function cloneRootWithMutation(
  root: FSDirectory,
  targetPath: string,
  mutate: (parent: FSDirectory, name: string) => boolean,
): FSDirectory | null {
  const info = getParentAndName(targetPath);
  if (!info) return null;

  const newRoot = cloneNode(root) as FSDirectory;
  const parent = getNodeAtPath(newRoot, info.parentPath);
  if (!parent || parent.type !== 'directory') return null;

  if (mutate(parent, info.name)) {
    return newRoot;
  }
  return null;
}

export const useFilesystemStore = create<FilesystemStore>((set, get) => ({
  root: { type: 'directory', name: '/', children: {}, createdAt: Date.now() },

  resolvePath: (path: string, cwd: string): string => {
    if (path.startsWith('~')) {
      path = '/home/rahul' + path.slice(1);
    }
    if (!path.startsWith('/')) {
      path = cwd + '/' + path;
    }
    return normalizePath(path);
  },

  getNode: (path: string): FSNode | null => {
    return getNodeAtPath(get().root, normalizePath(path));
  },

  listDirectory: (path: string): FSNode[] | null => {
    const node = getNodeAtPath(get().root, normalizePath(path));
    if (!node || node.type !== 'directory') return null;
    return Object.values(node.children).sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  },

  createFile: (path: string, content = ''): boolean => {
    const absPath = normalizePath(path);
    const newRoot = cloneRootWithMutation(get().root, absPath, (parent, name) => {
      if (parent.children[name]) return false;
      const now = Date.now();
      parent.children[name] = { type: 'file', name, content, createdAt: now, modifiedAt: now };
      return true;
    });
    if (newRoot) { set({ root: newRoot }); return true; }
    return false;
  },

  createDirectory: (path: string): boolean => {
    const absPath = normalizePath(path);
    const newRoot = cloneRootWithMutation(get().root, absPath, (parent, name) => {
      if (parent.children[name]) return false;
      parent.children[name] = { type: 'directory', name, children: {}, createdAt: Date.now() };
      return true;
    });
    if (newRoot) { set({ root: newRoot }); return true; }
    return false;
  },

  deleteNode: (path: string): boolean => {
    const absPath = normalizePath(path);
    if (absPath === '/') return false;
    const newRoot = cloneRootWithMutation(get().root, absPath, (parent, name) => {
      if (!parent.children[name]) return false;
      delete parent.children[name];
      return true;
    });
    if (newRoot) { set({ root: newRoot }); return true; }
    return false;
  },

  renameNode: (oldPath: string, newName: string): boolean => {
    const absPath = normalizePath(oldPath);
    const newRoot = cloneRootWithMutation(get().root, absPath, (parent, name) => {
      const node = parent.children[name];
      if (!node) return false;
      if (parent.children[newName]) return false;
      delete parent.children[name];
      const renamed = cloneNode(node);
      renamed.name = newName;
      parent.children[newName] = renamed;
      return true;
    });
    if (newRoot) { set({ root: newRoot }); return true; }
    return false;
  },

  updateFileContent: (path: string, content: string): boolean => {
    const absPath = normalizePath(path);
    const newRoot = cloneRootWithMutation(get().root, absPath, (parent, name) => {
      const node = parent.children[name];
      if (!node || node.type !== 'file') return false;
      parent.children[name] = { ...node, content, modifiedAt: Date.now() };
      return true;
    });
    if (newRoot) { set({ root: newRoot }); return true; }
    return false;
  },
}));

export function initializeFilesystem(tree: FSDirectory) {
  useFilesystemStore.setState({ root: tree });
}
