---
layout: page
title: Archives
description: An archive collection of all articles written by Jabran Rafique
permalink: /archives/
---

{% for article in site.categories.articles %}
  {% if article.private != true %}
    <article class="archive_article">
      <header class="archive_article-header">
        <h3 class="archive_article-title">
          <a href="{{ article.url }}">{{ article.title }}</a>
        </h3>
      </header>
      <p class="archive_article-excerpt">{{ article.excerpt | strip_html }}</p>
      <footer class="archive_article-footer">
        <em class="archive_article-publish-date">{{ article.date | date_to_long_string }}</em>
        {% if article.author %}
        <em class="archive_article-author">&bull; {{ article.author }}</em>
        {% endif %}
      </footer>
    </article>
  {% endif %}
{% endfor %}