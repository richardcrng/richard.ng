export const server =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://your_deployment.server.com";

const fetcher = async (urlOrPath: string) => {
  const url = urlOrPath.startsWith("/") ? `${server}${urlOrPath}` : urlOrPath;

  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

export default fetcher;
