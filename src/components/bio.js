import React from 'react';
import { Link } from 'gatsby';

import style from './bio.module.scss';

const Bio = () => {
  return (
    <>
      <div className={style.intro}>
        <p>
          Tech Lead at{' '}
          <a
            target="_blank"
            rel="noopener"
            href="https://www.ratedpeople.com/c/about-us"
          >
            Rated People
          </a>
        </p>
        <p>
          I am a Software Engineer with a passion for progressive and usable
          web. Some of the technologies and tools I work with regularly are{' '}
          <span className={style.stack}>
            JavaScript, nodeJS, React, Gatsby, Redux, CSS/Sass, Symfony,
            WordPress, Webpack, Composer, npm, docker, Cloudflare, AWS,
            Atlassian suite and more.
          </span>
        </p>
      </div>
      <p className={style.subintro}>
        I like to work on different ideas from time to time. Almost all of my
        projects are open-sourced and available at{' '}
        <a
          href="https://www.github.com/jabranr"
          target="_blank"
          rel="noopener noreferer"
        >
          GitHub
        </a>
        . Apart from web development, I have been a digital cartographer to map
        the unmapped areas of the world with{' '}
        <a
          href="https://mapmaker.google.com"
          target="_blank"
          rel="noopener noreferer"
        >
          Google Map Maker
        </a>{' '}
        from 2008 to 2013.
      </p>
      <p className={style.subintro}>
        I regularly{' '}
        <a
          href="https://www.twitter.com/jabranr"
          target="_blank"
          rel="noopener noreferer"
        >
          tweet
        </a>
        , share and contribute to{' '}
        <a
          href="https://www.github.com/jabranr"
          target="_blank"
          rel="noopener noreferer"
        >
          code
        </a>
        , <Link to="/articles">write</Link> my thoughts out and occasionally{' '}
        <Link to="/speaking">speak</Link> at events.
      </p>
    </>
  );
};

export default Bio;
