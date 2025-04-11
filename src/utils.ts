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

export function emptyToNull<T extends z.ZodTypeAny>(schema: T) {
  return schema.nullable().or(emptyStringToNull);
}
