---
layout: post
title: Building childcare vouchers business directory
date: 2022-10-01 01:00:00
categories: articles
tags: ['childcare', 'vouchers', 'directory', 'pay with childcare voucher']
excerpt: Summary of process to build a childcare vouchers business directory
comment: false
private: false
---

https://childcare-vouchers.uk

As a parent, if you had the chance to enrol on the childcare vouchers scheme, you might have also been wondering about spending all those vouchers somehow.

What is the childcare voucher scheme?
The childcare vouchers scheme is a way to save money pre-tax by sacrificing a portion of your salary every month. There are many providers that will manage those savings and ultimately the payments to different businesses. The scheme was closed on {insert_date} for new joiners. Since then an alternative option called tax-free childcare is available.

Spending or redeeming childcare vouchers can be a difficult task. You need to find a business that offers childcare/activities and accepts childcare vouchers as payment. Unfortunately, there is no list or directory so it's quite difficult to find those businesses.

There are many businesses running holiday camps, after-school clubs and other types of activities. Sadly, not all of them accept childcare vouchers as payment.

My wife and I had quite a difficult time finding suitable activities during the last summer holidays for our 6 years old. This led us to the idea to create this directory where anyone can find a list of those businesses that accept childcare vouchers payment.

Technical bits

There were quite simple goals for this:

- list of businesses
- option to add a business
- keep it simple
- keep it accessible

This is a straightforward site with hardly changing static content. Eleventy, a static site generator could not be any more perfect use for it. The data for providers and businesses live in the global `_data` directory directly fed into the build lifecycle of Eleventy.

Adding a business
I didn't want to keep separate storage for the data so I took some inspiration from the Eleventy community repository about storing new entries for sites built with Eleventy but with some twist.

- someone fills a form on the site to add new business
- it gets validated client-side before submission
- it gets validated server-side after submission (Cloudflare functions)
- the submission creates a new issue in the GitHub repository with submitted details
- the issue is reviewed manually and labelled as _approved_

These kicks start the GitHub actions pipeline that:

- checks for data integrity
- checks for a duplicate entry based on website or phone
- creates a new JSON file with provided data
- closes the issue with a comment
- commits changes back into the repository

This triggers the Cloudflare Pages build process and the site is built and deployed with the new entries. The process is fully automated except for the reviewing part.

I hope that this little side project will benefit many!

Visit at https://childcare-vouchers.uk
