import { ReadonlyURLSearchParams } from "next/navigation";
import { z } from "zod";

export const createUrl = (pathname: string, params: ReadonlyURLSearchParams | URLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length > 0 ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

interface ZodErrorData {
  data?: {
    zodError?: { fieldErrors: Record<string, string[]>; formErrors: Record<string, string[]> };
  };
}

const flattenErrorMessages = (errors: Record<string, string[]>): string[] => {
  return Object.values(errors).filter(Boolean).flat();
};

export function zodErrorsToString(error: ZodErrorData): string {
  const zodError = error.data?.zodError;

  if (!zodError) {
    return "";
  }

  const { fieldErrors, formErrors } = zodError;

  const allErrors = [...flattenErrorMessages(fieldErrors), ...flattenErrorMessages(formErrors)];

  return allErrors.join(", ");
}

const emptyStringToNull = z.literal("").transform(() => null);

export async function downloadAllConfigsForSite(clientId: number, siteId: number) {
  // Make a POST request to the server to download the zip file
  const response = await fetch(`/api/download/${clientId.toString()}/${siteId.toString()}`, {
    method: "POST",
  });

  const blob = await response.blob();
  const contentDisposition = response.headers.get("Content-Disposition");
  const suggestedName = contentDisposition?.split("filename=")[1] ?? "config.zip";

  // Use File System Access API to save the file
  if ("showSaveFilePicker" in globalThis) {
    try {
      // TODO pending fix https://github.com/microsoft/vscode/issues/141908
      const handle = await (globalThis as any).showSaveFilePicker({
        suggestedName,
        types: [
          {
            accept: {
              "application/zip": [".zip"],
            },
            description: "Zip Files",
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (error) {
      console.error(error);
    }
  } else {
    // Fallback for browsers that do not support the File System Access API
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = suggestedName;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  }
}

export function emptyToNull<T extends z.ZodType>(schema: T) {
  return schema.nullable().or(emptyStringToNull);
}
