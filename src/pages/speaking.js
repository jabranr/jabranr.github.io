import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

import africaMappers from '../../content/assets/images/speaking/africa-mappers.png';
import tedxLahore from '../../content/assets/images/speaking/tedx-lahore.png';
import gmmRegionalConference from '../../content/assets/images/speaking/gmm-regional-uae.png';
import geoUsersSummit from '../../content/assets/images/speaking/geo-summit-singapore.png';
import bigTent from '../../content/assets/images/speaking/big-tent-sendai.png';
import dscUet from '../../content/assets/images/speaking/dsc-uet-lahore.jpg';
import devFestLums from '../../content/assets/images/speaking/lums-devfest-2019.jpg';

import style from './speaking.module.scss';

const SpeakingPage = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location}>
      <SEO
        title="Speaking"
        keywords={[
          `speaking`,
          `jabran`,
          `rafique`,
          `javascript`,
          `react`,
          `google`,
          `maps`,
          `map maker`,
          `cartography`,
          `tech events`,
          `disaster relief`
        ]}
      />
      <h2 className={style.h2}>Speaking</h2>
      <p>
        I have spoken at various events in the past, ran workshops and training
        sessions. Mostly these talks were related to my work with{' '}
        <a
          href="https://mapmaker.google.com"
          target="_blank"
          rel="noopener noreferer"
        >
          Google Map Maker
        </a>
        . However I am now more focused towards tech, startups and mentoring.
      </p>

      <hr />
      <div className={style.speaking}>
        <div className={style.event}>
          <h3>Google Maps & Digital Landscape of Pakistan</h3>
          <h4>Google DevFest LUMS, Lahore &ndash; 2019</h4>
          <figure>
            <img
              src={devFestLums}
              alt="Jabran Rafique presenting at Google DevFest LUMS, Lahore 2019"
            />
            <figcaption>&copy; Tech Tology</figcaption>
          </figure>
          <p>
            I shared the stage with many amazing people to tell the stories of
            Google Maps and how hundreds of passionate volunteers mapped to
            shape the digital landscape of Pakistan on Google Maps.
          </p>
          <p>
            <a
              href="https://www.facebook.com/events/937081413342144"
              target="_blank"
              rel="noopener noreferer"
            >
              Event page &raquo;
            </a>
          </p>
        </div>
        <div className={style.event}>
          <h3>Google Maps: Drawing from clean slate</h3>
          <h4>University of Engineering & Technology, Lahore &ndash; 2019</h4>
          <figure>
            <img
              src={dscUet}
              alt="Jabran Rafique presenting at University of Engineering & Technology, Lahore"
            />
            <figcaption>&copy; DSC UET</figcaption>
          </figure>
          <p>
            I was invited to present to an amazing group of students of
            University of Engineering & Technology, Lahore – to share stories of
            mapping from time at Google Map Maker and all about on how Google
            Maps are drawn and how Google has mapped cities and countries.
          </p>
          <p>
            <a
              href="https://www.facebook.com/events/573032606858734"
              target="_blank"
              rel="noopener noreferer"
            >
              Event page &raquo;
            </a>
          </p>
        </div>
        <div className={style.event}>
          <h3>
            Citizen mapping: impact of crowd-sourced contributions on local
            populations
          </h3>
          <h4>Google Big Tent Sendai &ndash; 2011</h4>
          <figure>
            <img
              src={bigTent}
              alt="Jabran Rafique presenting at Google Big Tent Sendai"
            />
            <figcaption>&copy; Google Big Tent</figcaption>
          </figure>
          <p>
            I was invited along with{' '}
            <a
              href="https://www.twitter.com/momers"
              target="_blank"
              rel="noopener noreferer"
            >
              Omer Sheikh
            </a>
            , a fellow mapper to highlight our mapping efforts through Google
            Map Maker during couple of natural disasters that helped facilitate
            relief and rescue efforts on grounds for various agencies such as
            UNITAR/UNOSAT.
          </p>
          <p>
            <a
              href="https://googleblog.blogspot.com/2012/07/big-tent-sendai-smarter-ways-to-share.html"
              target="_blank"
              rel="noopener noreferer"
            >
              Google blog &raquo;
            </a>
          </p>
        </div>
        <div className={style.event}>
          <h3>Mapper Stories: Pakistan</h3>
          <h4>Google Geo Users Summit Singapore &ndash; 2011</h4>
          <figure>
            <img
              src={geoUsersSummit}
              alt="Jabran Rafique presenting at Google Geo Users Summit Singapore"
            />
            <figcaption>&copy; Google</figcaption>
          </figure>
          <p>
            The Summit hosted Google Map Maker Mappers, Geo Modelers, Panoramio
            Enthusiasts from Asia Pacific to celebrate their contribution in
            crowd-sourced efforts and to set new strategies to increase
            community engagement.
          </p>
          <p>
            <a
              href="https://sites.google.com/site/2011geocommunityapac/"
              target="_blank"
              rel="noopener noreferer"
            >
              More details &raquo;
            </a>
          </p>
          <p>
            <a
              href="https://maps.googleblog.com/2011/04/celebrating-top-geo-contributors-in.html"
              target="_blank"
              rel="noopener noreferer"
            >
              Google blog &raquo;
            </a>
          </p>
        </div>
        <div className={style.event}>
          <h3>Mapper Stories: Pakistan</h3>
          <h4>Google Map Maker Regional Conference Dubai &ndash; 2011</h4>
          <figure>
            <img
              src={gmmRegionalConference}
              alt="Jabran Rafique presenting at Google Map Maker Regional Conference Dubai"
            />
            <figcaption>&copy; Google</figcaption>
          </figure>
          <p>
            The Regional Conference brought most active cartographers together
            to meet, have fun and learn from each other. Teams and individuals
            from each region presented their interesting stories of mapping and
            how digital maps have helped their regions.
          </p>
          <p>
            <a
              href="https://sites.google.com/site/2012mapmakercommunity/mena"
              target="_blank"
              rel="noopener noreferer"
            >
              More details &raquo;
            </a>
          </p>
        </div>
        <div className={style.event}>
          <h3>
            Disaster Response, case of Pakistan / Map Maker for mobile, some
            thoughts
          </h3>
          <h4>Africa Supper Mappers Conference, Kenya &ndash; 2010</h4>
          <figure>
            <img
              src={africaMappers}
              alt="Jabran Rafique presenting at Africa Supper Mappers Conference, Kenya"
            />
            <figcaption>&copy; Google</figcaption>
          </figure>
          <p>
            I was invited along with{' '}
            <a
              href="https://www.twitter.com/farazilu"
              target="_blank"
              rel="noopener noreferer"
            >
              Faraz Ahmad
            </a>{' '}
            , a fellow mapper at Google Map Maker to share our experience and
            strategies we adapted to rapidly map Pakistan &ndash; with keeping
            up the quality. This helped attendees learn different methodologies
            towards digital cartography of Africa.
          </p>
          <p>
            <a
              href="https://sites.google.com/site/superafricamappers/home"
              target="_blank"
              rel="noopener noreferer"
            >
              More details &raquo;
            </a>
          </p>
        </div>
        <div className={style.event}>
          <h3>All you need is a map and some goodwill</h3>
          <h4>TEDx Lahore &ndash; 2010</h4>
          <figure>
            <img
              src={tedxLahore}
              alt="Jabran Rafique presenting at TEDx Lahore"
            />
            <figcaption>&copy; TEDx Lahore</figcaption>
          </figure>
          <p>
            I was invited along with{' '}
            <a
              href="https://www.twitter.com/momers"
              target="_blank"
              rel="noopener noreferer"
            >
              Omer Sheikh
            </a>{' '}
            at TEDx Lahore 2010 to speak about improtance of open access to
            public information and data &ndash; especially during times of
            natural disasters. We spoke about the struggle faced by agencies due
            to limited and restricted availability of information and data.
          </p>
          <p>
            <a
              href="https://www.ted.com/tedx/events/915"
              target="_blank"
              rel="noopener noreferer"
            >
              More details &raquo;
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SpeakingPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { private: { eq: false }, categories: { eq: "articles" } }
      }
      limit: 1000
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            permalink
            thumbnail {
              childImageSharp {
                resize(width: 125, height: 125) {
                  src
                  aspectRatio
                }
              }
            }
          }
        }
      }
    }
  }
`;
