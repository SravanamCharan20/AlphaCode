const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:9999";

type ApiBody = RequestInit["body"] | Record<string, unknown>;
type ApiOptions = Omit<RequestInit, "body"> & {
  body?: ApiBody;
};

function parseJson(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

function getErrorMessage(data: unknown) {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = data.message;
    if (typeof message === "string") {
      return message;
    }
  }

  return "Request failed";
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      !hasBody || isFormData || typeof options.body === "string"
        ? (options.body as RequestInit["body"])
        : JSON.stringify(options.body),
    credentials: "include",
  });

  const raw = await response.text();
  const data = raw ? parseJson(raw) : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as T;
}
