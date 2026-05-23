import { unzipSync, zipSync, strToU8, strFromU8 } from "fflate";

export type OfflineBackupManifest = {
  version: 1;
  exported_at: string;
  data: any;
  files: { path: string; name: string; mime?: string; size?: number }[];
};

export function buildBackupZip(args: {
  manifest: OfflineBackupManifest;
  fileBytesByPath: Record<string, Uint8Array>;
}): Uint8Array {
  const { manifest, fileBytesByPath } = args;
  const files: Record<string, Uint8Array> = {
    "manifest.json": strToU8(JSON.stringify(manifest, null, 2)),
  };

  for (const f of manifest.files) {
    const bytes = fileBytesByPath[f.path];
    if (!bytes) continue;
    files[`files/${f.path}`] = bytes;
  }

  return zipSync(files, { level: 6 });
}

export function parseBackupZip(zipBytes: Uint8Array): {
  manifest: OfflineBackupManifest;
  fileBytesByPath: Record<string, Uint8Array>;
} {
  const unpacked = unzipSync(zipBytes);
  const manifestBytes = unpacked["manifest.json"];
  if (!manifestBytes) throw new Error("Missing manifest.json");
  const manifest = JSON.parse(strFromU8(manifestBytes)) as OfflineBackupManifest;
  if (!manifest || manifest.version !== 1) throw new Error("Unsupported backup format");

  const fileBytesByPath: Record<string, Uint8Array> = {};
  for (const key of Object.keys(unpacked)) {
    if (!key.startsWith("files/")) continue;
    const rel = key.slice("files/".length);
    fileBytesByPath[rel] = unpacked[key];
  }

  return { manifest, fileBytesByPath };
}

