export function useMediaUrl() {
   const { mediaBaseUrl } = useRuntimeConfig().public;

   return (key: string) => `${mediaBaseUrl}/${key}`;
}
