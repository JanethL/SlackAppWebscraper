const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
/**
* An HTTP endpoint that acts as a webhook for Slack command event
* @param {object} event
* @returns {object} result Your return value
*/
module.exports = async (event) => {
  // Store API Responses
  const result = {slack: {}, crawler: {}};
  
  if ((event.text || '').split(/\s+/).length != 3) {
    return lib.slack.channels['@0.6.6'].messages.create({
      channel: `#${event.channel_id}`,
      text: `${event.text} has wrong format. `
    });
  }
  
  console.log(`Running [Slack → Retrieve Channel, DM, or Group DM by id]...`);
  result.slack.channel = await lib.slack.conversations['@0.2.5'].info({
      id: `${event.channel_id}`
  });
  console.log(`Running [Slack → Retrieve a User]...`);
  result.slack.user = await lib.slack.users['@0.3.32'].retrieve({
      user: `${event.user_id}`
  });
  
  console.log(`Running [Crawler → Query (scrape) a provided URL based on CSS selectors]...`);
  result.crawler.pageData = await lib.crawler.query['@0.0.1'].selectors({
      url: event.text.split(/\s+/)[0],
      userAgent: `stdlib/crawler/query`,
      includeMetadata: false,
      selectorQueries: [
          {
              'selector': event.text.split(/\s+/)[1],
              'resolver': `attr`,
              'attr': event.text.split(/\s+/)[2]
          }
      ]
  });
  let text = `Here are the links that we found for ${event.text.split(/\s+/)[0]}\n \n ${result.crawler.pageData.queryResults[0].map((r) => {
    if (r.attr.startsWith('http://') || r.attr.startsWith('https://') || r.attr.startsWith('//')) {
        return r.attr;
    } else {
        return result.crawler.pageData.url + r.attr;
    }
  }).join(' \n ')}`;
  console.log(`Running [Slack → Send a Message from your Bot to a Channel]...`);
  result.slack.response = await lib.slack.channels['@0.6.6'].messages.create({
    channel: `#${event.channel_id}`,
    text: text
  })
  return result;
};