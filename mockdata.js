// this file creates a set of mock data for Clicks and Links using the live Hyperlink API
// it is used to populate the database with data for testing
// there will be 7 link created and between 15-30 clicks created for each
// the links will be created with a random number of clicks between 15-30
// all the links will have the same ksn attached to it

const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const linkCount = 7;
const targets = [
  'https://www.google.com',
  'https://www.facebook.com',
  'https://www.twitter.com',
  'https://www.instagram.com',
  'https://www.youtube.com',
  'https://www.reddit.com',
  'https://www.pinterest.com',
];

const getClickCount = () => {
  return Math.floor(Math.random() * 5) + 5;
};

const generateMockData = async () => {
  for (let i = 0; i < linkCount; i++) {
    let response;

    try {
      response = await axios.post(
        'https://api.kreativehyperlink.com/v1/links/user',
        {
          target: targets[i],
          public: false,
        },
        {
          headers: {
            KREATIVE_ID_KEY: process.env.MOCKDATA_ID_KEY,
            KREATIVE_AIDN: process.env.HOST_AIDN,
            KREATIVE_APPCHAIN: process.env.HOST_APPCHAIN,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }

    const link = response.data.data.link;

    console.log(`------ CREATED LINK khyper.link/${link.extension} | ${link.target}`);

    const clickCount = getClickCount();

    for (let j = 0; j < clickCount; j++) {
      const click = await prisma.click.create({
        data: {
          ipAddress: '127.0.0.1',
          country: 'US',
          region: 'IA',
          city: 'Ames',
          postal: '50010',
          loc: '42.034722,-93.62',
          timezone: 'America/Chicago',
          os: 'Mac OS',
          browser: 'Chrome',
          browserVersion: '87.0.4280.88',
          deviceType: 'Desktop',
          deviceVendor: 'Apple',
          ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
          referralUrl: 'https://www.google.com',
          linkId: link.id,
        },
      });

      console.log(`------------ CREATED CLICK ${click.id}`);
    }
  }
};

console.log('MOCK DATA GENERATOR STARTING');
console.log(`CREATING ${linkCount} LINKS`);
console.log('CREATING 15-30 CLICKS FOR EACH LINK');
console.log('LETS BEGIN!!!!');

generateMockData();