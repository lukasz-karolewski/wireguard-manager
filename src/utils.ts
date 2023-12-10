import { ReadonlyURLSearchParams } from "next/navigation";

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export function zodErrorsToString(error: any) {
  const zodError = error.data?.zodError;
  let errorMessage = "";

  if (zodError) {
    const { fieldErrors, formErrors } = zodError;

    const flattenErrors = (errors: Record<string, string[]>) => {
      for (const errorKey in errors) {
        if (errors[errorKey]) {
          errorMessage += errors[errorKey].join(", ") + ", ";
        }
      }
    };

    flattenErrors(fieldErrors);
    flattenErrors(formErrors);

    // Remove trailing comma and space
    errorMessage = errorMessage.slice(0, -2);
  }
  return errorMessage;
}
