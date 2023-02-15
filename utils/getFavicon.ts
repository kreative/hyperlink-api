export function getFavicon(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let parsedUrl: any;

    try {
      parsedUrl = new URL(url);
    } catch (error) {
      reject(error);
    }

    const faviconUrl = `https://${parsedUrl.host}/favicon.ico`;
    resolve(faviconUrl);
  });
}
