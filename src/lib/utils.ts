import { FileCollection } from "@/components/ui/file-explorer";
import { TreeItem } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertFilesToTreeItems(
  files : FileCollection
) : TreeItem[] {
  interface TreeNode {
    [key: string]: TreeNode | null;
  }
  const tree: TreeNode = {};

  const sortedPaths = Object.keys(files).sort();

  for(const path of sortedPaths) {
    const parts = path.split('/');
    let currentNode = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!currentNode[part]) {
        currentNode[part] = {};
      }
      currentNode = currentNode[part] as TreeNode;
    }

    const fileName = parts[parts.length - 1];
    currentNode[fileName] = null;
  }

  function convertNode(node: TreeNode, name? : string): TreeItem[] {
    const entries = Object.entries(node);

    if(entries.length === 0) {
      return name ? [name] : [];
    }

    const children : TreeItem[] = [];

    for(const [key, value] of entries) {
      if(value === null) {
        children.push(key);
      } else {
        const subTree = convertNode(value, key);
        if(Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        }
        else {
          children.push([key, subTree]);
        }
      }
    }
    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
};