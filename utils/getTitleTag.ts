import cheerio = require('cheerio');

export async function getTitleTag(url: string): Promise<string> {
  let body: string;

  try {
    // gets the raw html document in a GET request
    const response = await fetch(url);
    // gets html page text from the response
    body = await response.text();
  } catch (error) {
    // some sort of an error was thrown when fetching the url
    // or there was an error with getting the body
    // we just return the default string from Schema as we need the code to continue
    console.log(error);
    return 'Untitled';
  }

  // load the html page into cheerio
  const $ = cheerio.load(body);

  // get the title tag from the html page
  const title: string = $('title').text();

  // returns the title tag
  return title;
}
