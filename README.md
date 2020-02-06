# Fathom Analytics for Craft CMS

Statistics and chart widgets for Fathom analytics.

![Screenshot](resources/img/screenshot.png)

## A word about privacy, GDPR, &hellip;

There has been a lot of talk about GDPR, cookies, privacy, &hellip; It's becoming more clear that big companies like Google are tracking you. Nearly every site I visit has Google Analytics installed on it. 

Even configuring Google Analytics to not send your IP address (i.e. setting `anonymizeIp` **true**) is being considered not in regulation of the privacy laws in Europe. Whether or not that's true, you're sharing a lot of data with Google. According to [BuiltWith](https://trends.builtwith.com/analytics/Google-Analytics) at the time of writing, more than 60% of the top 1m sites use Google Analytics. That's a horrific number, considering Google can use this data to keep a profile of you and your browsing habbits.

Fathom Lite offers a free option you can self-host. Fathom already is commited about your privacy, and self-hosting it means you're not sharing any data with third party services.

## A word about cookies

Fathom Lite still uses cookies. But since you are not sharing any data with third party services, and Fathom does not store any personally identifiable information, you and your users data are **safe**.

## Requirements

This plugin requires Craft CMS 3.0.0-beta.23 or later.

## Installation

To install the plugin, follow these instructions.

1. Open your terminal and go to your Craft project:

        cd /path/to/project

2. Then tell Composer to load the plugin:

        composer require stenvdb/fathom-analytics

3. In the Control Panel, go to Settings → Plugins and click the “Install” button for Fathom Analytics.

## Fathom Analytics Overview

This plugin **only works with Fathom Lite**, the self-hosted open source version. Reasons being Fathom does not have an official documented API. Once Fathom releases a documented API ([which might be in the works](https://trello.com/c/wu4WMy4U/16-api)), I'll consider providing support for Fathom Pro. In the meantime, this plugin uses Fathom's already great internal API. 

But working with Fathom Lite has its advantages, since you're self-hosting the app, which is [super easy](https://github.com/usefathom/fathom/blob/master/docs/Installation%20instructions.md), you're not sharing any data with third party services. I don't have to explain you this has its privacy beneftis.

## Configuring Fathom Analytics

This plugin obviously requires Fathom running on one of your servers. Once it is up and running, configure Fathom Analytic's settings:

```
// The domain name where Fathom is hosted. This is also the URL where the tracker code is pointed to.
'baseUri' => getenv('EXAMPLE_BASE_URI'),

// The tracking ID of this site. You can find the ID in your tracking code snippet, e.g.: ABCDE
'trackingId' => ABCDE,

'username' => getenv('EXAMPLE_USERNAME'),

'password' => getenv('EXAMPLE_PASSWORD')
```

## Fathom Analytics Roadmap

* Support Fathom Pro
* Entry tracking report field (on a per entry basis)
* Have an idea? [Let me know](https://stenvdb.be/contact)

Brought to you by [Sten Van den Bergh](https://stenvdb.be)
