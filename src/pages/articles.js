import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

import style from './index.module.scss';

const ArticlesPage = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location}>
      <SEO
        title="Articles"
        keywords={[`blog`, `jabran`, `rafique`, `javascript`, `react`]}
      />
      <h2 className={style.h2}>Articles</h2>
      <p>An archive collection of all articles written by Jabran Rafique.</p>
      {posts.map(({ node }) => (
        <Link
          className={style.card}
          to={node.fields.slug}
          key={node.fields.slug}
        >
          {node.frontmatter.thumbnail && (
            <img
              src={node.frontmatter.thumbnail.childImageSharp.resize.src}
              className={style.thumbnail}
              alt=""
            />
          )}
          <div>
            <div className={style.timestamp}>{node.frontmatter.date}</div>
            <h3 className={style.h3}>
              {node.frontmatter.title || node.fields.slug}
            </h3>
            <p
              className={style.excerpt}
              dangerouslySetInnerHTML={{ __html: node.excerpt }}
            />
          </div>
        </Link>
      ))}
    </Layout>
  );
};

export default ArticlesPage;

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
