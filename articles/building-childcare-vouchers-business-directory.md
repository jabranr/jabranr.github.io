---
layout: post
title: Building childcare vouchers business directory
date: 2023-02-21 01:00:00
categories: articles
tags:
  [
    'articles',
    'childcare',
    'vouchers',
    'directory',
    'pay with childcare voucher'
  ]
excerpt: Summary of various steps involved to build a business directory accepting childcare vouchers as payment
comment: true
private: false
---

As a parent, if you had the chance to enrol yourself on the Childcare Vouchers scheme, you might have also been wondering about spending all those vouchers now. I have struggled to find businesses that would accept payment with vouchers. So my [wife, Ruby](https://hennabyruby.com) and I came up with an idea to help myself and all of you.

## What is the Childcare Voucher scheme?

The childcare vouchers scheme is a way to save money by sacrificing a portion of your pre-tax salary every month. Many providers will manage those savings and payments to different businesses. The scheme was closed on 4 October 2018 for new joiners. Since then alternative options are available such as [tax-free childcare](https://www.gov.uk/get-tax-free-childcare) and [universal credit](https://www.gov.uk/universal-credit).

Spending or redeeming childcare vouchers can be a challenging task. You need to find a business that offers suitable childcare/activities and accepts childcare vouchers as payment. Unfortunately, there is no public list or directory of those businesses so it's quite difficult to find them.

Though there is an abundance of businesses offering holiday camps, after-school clubs and other types of activities. Sadly, not all of them accept childcare vouchers as payment. From my personal experience, some of those didn't even know about the scheme.

My wife and I had quite a difficult time finding suitable activities during the last summer holidays for our 6 years old. Searching on the internet only leads to information about the scheme. A few forums such as Netmums had some information about businesses but it was location-centric.

This led us to the idea to create this directory where anyone can find a list of those businesses that accept childcare vouchers payment.

Enter [https://childcare-vouchers.uk](https://childcare-vouchers.uk) 🚀

## Technical stuff

I had a lot of fun creating this platform. I wanted to keep the tech stack to a minimum and the portal as accessible as possible. Here I cover the technical side of things in building this platform.

### Goals

- The basic goals to achieve were:
- show a list of businesses
- show an option to add a business
- keep it simple
- keep it accessible
- keep it performant

### Tech stack

This is a straightforward site with most of its content changed rarely. [Eleventy](https://www.11ty.dev), a static site generator could not be any more perfect tool for it.

There are two types of businesses dataset required to build the directory.

- Businesses who manage the Childcare Vouchers – I am calling them "providers".
- Businesses who accept payment with Childcare Vouchers – I am calling them "businesses".

The data for both providers and businesses live in the `_data` directory and it is directly fed into the build lifecycle of Eleventy.

Here is a pseudo structure:

```text
|_data/
 |-- providers.js
 |-- consumers.js
```

### Adding a business

Anyone can add a business to this directory by filling in a short form.

<img src="../../assets/images/childcare_vouchers_add_business.png" alt="Traffic graph for childcare-vouchers.uk website" />

I didn't want to keep separate storage for the data submitted by the users. I took some inspiration from the [Eleventy community repository](https://github.com/11ty/11ty-community/) but with some twist.

- a user will fill out a form on the site to add new business
- it gets validated client-side before submission
- it gets validated server-side after submission (Cloudflare functions)
- the successful submission creates a new issue in the GitHub repository with the submitted details

It makes use of GitHub API. I get the notification and review the submission manually. I label it as _approved_ if this is all good to go.

> I would love to automate this at some point when and if it gets out of hand.

This kick starts the GitHub actions pipeline that:

- checks for data integrity
- checks for a duplicate entry based on the website URL and phone number
- creates a new JSON file with provided data
- commits changes back into the repository
- closes the issue with a comment

If data integrity fails or a duplicate is found then no new JSON file is created but the issue is closed without any further actions.

On successful new JSON file entry, it triggers the Cloudflare Pages build process to build the site. Then it is deployed with the new entries. The process is fully automated except for the reviewing part. There are only a couple of page templates in it and the UI is kept very simple and responsive. I used [Tailwind CSS](https://tailwindcss.com) for styling because it enabled rapid development to get the MVP out as quickly as possible.

Here is a screenshot of steady increasing traffic from organic search results.

<img src="../../assets/images/childcare_vouchers_traffic.png" alt="Traffic graph for childcare-vouchers.uk website" />

I enjoyed building this simple, fun, helpful and adventurous project. I hope that this little side project will benefit many more.

Visit it at [https://childcare-vouchers.uk](https://childcare-vouchers.uk)
