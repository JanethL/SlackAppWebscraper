# README
[<img src="https://deploy.stdlib.com/static/images/deploy.svg?" width="192">](https://deploy.stdlib.com/)

# Slack app Website Scraper 

In the [last tutorial](https://github.com/JanethL/WebScraper), we learned how to use [crawler.api](https://stdlib.com/@crawler/lib/query) on Standard Library to scrape websites using CSS selectors and as an example, we scraped the front page of The Economist for titles and their respective URLs. 

In this tutorial, we will learn to retrieve and send our scraped data into Slack. We'll set up a Slack app that scrapes websites for links using a Slack slash command and posts the results inside a Slack channel like this:

# Table of Contents

1. [How It Works](#how-it-works)
1. [Installation](#installation)
1. [Test Your Workflow](#test-your-workflow)
1. [Making Changes](#making-changes)
   1. [via Web Browser](#via-web-browser)
   1. [via Command Line](#via-command-line)
1. [Support](#support)
1. [Acknowledgements](#acknowledgements)

# How It Works

``` javascript 

1. const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
2. /**
3. * An HTTP endpoint that acts as a webhook for Slack command event
4. * @param {object} event
5. * @returns {object} result Your return value
6. */
7. module.exports = async (event) => {
8.   // Store API Responses
9.   const result = {slack: {}, crawler: {}};
10.   
11.   if ((event.text || '').split(/\s+/).length != 3) {
12.     return lib.slack.channels['@0.6.6'].messages.create({
13.       channel: `#${event.channel_id}`,
14.       text: `${event.text} has wrong format. `
15.     });
16.   }
17.  
18.   console.log(`Running [Slack → Retrieve Channel, DM, or Group DM by id]...`);
19.   result.slack.channel = await lib.slack.conversations['@0.2.5'].info({
20.       id: `${event.channel_id}`
21.   });
22.   console.log(`Running [Slack → Retrieve a User]...`);
23.   result.slack.user = await lib.slack.users['@0.3.32'].retrieve({
24.       user: `${event.user_id}`
25.   });
26.   
27.   console.log(`Running [Crawler → Query (scrape) a provided URL based on CSS selectors]...`);
28.   result.crawler.pageData = await lib.crawler.query['@0.0.1'].selectors({
29.      url: event.text.split(/\s+/)[0],
30.       userAgent: `stdlib/crawler/query`,
31.       includeMetadata: false,
32.       selectorQueries: [
33.          {
34.               'selector': event.text.split(/\s+/)[1],
35.               'resolver': `attr`,
36.               `attr`: `href`
37.           }
38.       ]
39.   });
40.   let text = `Here are the links that we found for ${event.text.split(/\s+/)[0]}\n \n ${result.crawler.pageData.queryResults[0].map((r) => {
41.     if (r.attr.startsWith('http://') || r.attr.startsWith('https://') || r.attr.startsWith('//')) {
42.         return r.attr;
43.     } else {
44.         return result.crawler.pageData.url + r.attr;
45.     }
46.   }).join(' \n ')}`;
47.   console.log(`Running [Slack → Send a Message from your Bot to a Channel]...`);
48.   result.slack.response = await lib.slack.channels['@0.6.6'].messages.create({
49.     channel: `#${event.channel_id}`,
50.     text: text
51.   })
52.   return result;
53. };


``` 
The first line of code imports an NPM package called “lib” to allow us to communicate with other APIs on top of Standard Library:

`const lib = require(‘lib’)({token: process.env.STDLIB_SECRET_TOKEN});` 

Line 2–6 is a comment that serves as documentation and allows Standard Library to type check calls to our functions. If a call does not supply a parameter with a correct (or expected type) it would return an error.

Line 7 is a function (module.exports) that will export our entire code found in lines 8–54. Once we deploy our code, this function will be wrapped into an HTTP endpoint (API endpoint) and it’ll automatically register with Slack so that every time a Slack command event happens, Slack will send the event payload for our API endpoint to consume.

Line 11-16 is an if statement that handles improper inputs and posts a message to Slack using 
lib.slack.channels['@0.6.6'].messages.create. 

Line 18-21 makes an HTTP GET request to the lib.slack.conversations[‘@0.2.5’] API and uses the info method to retrieve the channel object which has info about the channel including name, topic, purpose etc and stores it in result.slack.channel.

Line 22-25 also makes an HTTP GET request to lib.slack.users[‘@0.3.32’] and uses theretrieve method to get the user object which has info about the user and stores it in result.slack.user.

Line 27-39 is making an HTTP GET request to lib.crawler.query['@0.0.1'] and passes in inputs from when a Slack command event is invoked. For the `url` we want to crawl we pass in the first input from our Slack event `event.text.split(/\s+/)[0]`.

`userAgent` is set to the default: `stdlib/crawler/query` 

`includeMetadata` is `False` (if True, will return additional metadata in a meta field in the response)

`selectorQueries` is an array with one object, the values being {`selector`:`event.text.split(/\s+/)[1]`,`resolver':'attr`, `attr`: `href`}

For `selector` we retrieve the second input from the Slack event using `event.text.split(/\s+/)[1]`.  

Lines 40–53 creates and posts your message using the information (parameters) that are passed in: channelId, Text.
You can read more about API specifications and parameters here: https://docs.stdlib.com/connector-apis/building-an-api/api-specification/

# Installation

Click this deploy from Autocode button  To quickly set up your project on Autocode.

[<img src="https://deploy.stdlib.com/static/images/deploy.svg?" width="192">](https://deploy.stdlib.com/)

You will be prompted to sign in or create a **FREE** account. If you have a Standard Library account click **Already Registered** and sign in using your Standard Library credentials.

# Test Your Workflow
# Making Changes
# Support
# Acknowledgements
