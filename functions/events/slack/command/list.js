const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

/**
* An HTTP endpoint that acts as a webhook for Slack command event
* @param {object} event
* @returns {object} result Your return value
*/
module.exports = async (event) => {

  // Store API Responses
  const result = {slack: {}};

  console.log(`Running [Slack → Retrieve Channel, DM, or Group DM by id]...`);
  result.slack.channel = await lib.slack.conversations['@0.2.5'].info({
    id: `${event.channel_id}`
  });

  console.log(`Running [Slack → Retrieve a User]...`);
  result.slack.user = await lib.slack.users['@0.3.32'].retrieve({
    user: `${event.user_id}`
  });

  
  await lib.slack.channels['@0.6.6'].messages.create({
    channel: `#${event.channel_id}`,
    text:
    ` Here is a list of websites with their respective selectors: \n\n \t/cmd scrape https://techcrunch.com  a.post-block__title__link \n\n \t/cmd scrape https://www.economist.com/ a.headline-link href \n\n \t/cmd scrape https://markets.businessinsider.com  a.teaser-headline href \n\n \t/cmd scrape https://news.ycombinator.com  a.storylink href \n\n \t/cmd scrape https://www.nytimes.com a href \n\n \t/cmd scrape https://www.cnn.com  a href \n\n \t/cmd scrape https://www.bbc.com a.media__link href`
      });
    

  return result;

};
