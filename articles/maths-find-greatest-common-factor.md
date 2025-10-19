---
layout: post
title: Find Greatest Common Factor (Maths series)
date: 2025-10-20 09:00:00
categories: articles
tags:
  [
    'articles',
    'maths',
    'programming',
    'formulas',
    'algorithm',
    'factor',
    'gcf',
    'gcd',
    'hcf',
    'hcd'
  ]
excerpt: Documenting my journey of re-learning maths by teaching and helping my son for his 11+ test. Here I learn how to find Great Common Factor (GCF) for given numbers.
comment: false
private: false
---

GCF (or HCF) is the largest positive natural number (integer) that divides all given numbers without a remainder. For example, GCF of 18 and 27 is 9.

Here is a tree breakdown of finding all factors and then choose the common highest factor:

<div class='sm:flex sm:gap-4 sm:justify-evenly sm:[&>*]:grow'>

```js
        18
      /   \
      9     2
    /  \    \
  3     3    1
 /     /
 1    1

```

```js
        27
      /   \
      9     3
    /  \    \
  3     3    1
 /     /
 1    1
```

</div>

### Problem

Let's think of a real-life example to make use of GCF.

- A baker has 24 chocolate muffins and 36 vanilla muffins.
- He wants to pack them in boxes so each box has the same number of muffins and no muffins are left out.

### Solution

We can make use of [Euclid’s Algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm).

- Subtract smallest number from largest number
- Subtract smallest number from result of previous calculation until reach zero
- GCF is the number before it reached zero

So from our above example we have largest number is 36 and smallest number is 24:

```
36 - 24 = 12
24 - 12 = 12
12 - 12 = 0
```

So the GCF is 12 that means the baker needs 12 of each muffins in a box for equal share with no left overs.

Here’s a small JavaScript method:

```js
function gcf(num1, num2) {
  const max = Math.max(num1, num2);
  const min = Math.min(num1, num2);
  const diff = max - min;

  if (diff > 0) return gcf(min, diff);
  return min;
}
```

**Example:**

```js
gcf(24, 36); // 12
```

---

### GCF for Multiple Numbers

It gets interesting when there are more than 2 numbers. Using the same Euclid's Algorithm, we can select two largest numbers in given list of numbers and find GCF. Let's say we want to find GCF for 20,50,125 so it will be:

```
answer = GCF(GCF(125, 50), 20)
```

Let create a helper method to find 2 largest numbers from the list of numbers:

```js
function getTwoLargest(...args) {
  const max = Math.max(...args);
  const rest = args.filter((n) => n !== max);
  const secondMax = Math.max(...rest);
  return [max, secondMax];
}
```

Let's use this in our original GCF method:

```js
// accept unknown list of numbers
function gcf(...args) {
  // reduce to 2 max numbers if needed
  const [num1, num2] = args.length > 2 ? getTwoLargest(...args) : args;

  // rest of the methods remains same as before
  const max = Math.max(num1, num2);
  const min = Math.min(num1, num2);
  const diff = max - min;

  if (diff > 0) return gcf(min, diff);
  return min;
}
```

**Example:**

```js
gcf(20, 50, 125); // GCF of all three is 25
```

This same method can be used to find:

- Greatest Common Denominator (GCD)
- Greatest Common Divisor (GCD)

> ### Maths meets programming
>
> Helping my son, Omer prepare for the 11+ test reignited my interest in maths. With over couple of decades in programming, I naturally started applying what I was learning—turning formulas into code. This blog is my way of documenting that journey.
>
> > These are simple problems, often solved and available on coding platforms, but this is my personal exploration of learning and implementation.

### Others in the Maths series

- [Find sum of Consecutive numbers](/articles/maths-sum-of-consecutive-numbers/)
