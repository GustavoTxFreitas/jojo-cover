import React from 'react'
import { graphql } from 'gatsby'

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

export default function Index(props: IndexPageProps) {

    return (
      <div>
        <h1>Hi people</h1>
        <p>
          Welcome to your new{' '}
          <strong>{props.data.site.siteMetadata.title}</strong> site.
        </p>
        <p>Now go build something great.</p>
      </div>
    )
  
}

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
