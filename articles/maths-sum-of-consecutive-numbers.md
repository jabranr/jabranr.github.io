---
layout: post
title: Sum of consecutive numbers (Maths series)
date: 2025-10-19 09:00:00
categories: articles
tags: ['articles', 'maths', 'programming', 'formulas', 'algorithm', 'sum']
excerpt: Documenting my journey of re-learning maths by teaching and helping my son for his 11+ test. Here I learn how to find sum of given consecutive numbers.
comment: false
private: false
---

> ### Maths meets programming
>
> Helping my son prepare for the 11+ test reignited my interest in maths. With over couple of decades in programming, I naturally started applying what I was learning—turning formulas into code. This blog is my way of documenting that journey.
>
> > These are simple problems, often solved and available on coding platforms, but this is my personal exploration of learning and implementation.

To find sum of `n` given numbers. For example, `1,2,3,4,5` will be `1 + 2 + 3 + 4 + 5 = 15`.

### Problem

It looks easy for small list of numbers but quickly becomes a difficult task as list grows.

### Solution

To find the sum of numbers like `1, 2, 3, ..., n`, the quickest thought was to loop through numbers but instead of looping through them, use this elegant formula:

```js
sum = (n * (n + 1)) / 2;
```

> where `n` is the largest number in the list i.e. for `1,2,3,4...100`, n = 100`

Here’s a small JavaScript method:

```js
function sum(...args) {
  const n = Math.max(...args);
  return (n * (n + 1)) / 2;
}
```

**Example:**

```js
sum(1, 2, 3, 4, 5); // 15
```

### Others in the Maths series

- [Find Greatest Common Factor (GCF)](/articles/maths-find-greatest-common-factor/)
