import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import DatePicker from "react-datepicker";
import Layout from "../layouts";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
    allJojoVolume: {
      nodes: {
        id: number;
        english_title: string;
        japanese_title: string;
        volume: string;
        cover: string;
        release_date: string;
      }[];
    };
  };
}

export default function Index(props: IndexPageProps) {
  const { site, allJojoVolume } = props.data;
  const jojos = allJojoVolume.nodes;
  const [birthday, setBirthday] = useState(new Date());
  const [closestIndex, setClosestIndex] = useState(0);

  const years = Array.from({length: 1901}, (x, i) => i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  useEffect(() => {
    let closestDay = Number.MAX_SAFE_INTEGER
    for(let i = 0; i < jojos.length; i++)
    {
      console.log(jojos[i])
      const diff = Math.abs(birthday.getTime() - new Date(jojos[i].release_date).getTime());

      if(diff < closestDay){
        closestDay = diff;
        setClosestIndex(i);
      }
      else if (diff > closestDay)
      {
        break;
      }
    }
  }, [birthday])
  
  return (
    <Layout title={site.siteMetadata.title}>
      <h1>Hi people</h1>
      <DatePicker
        selected={birthday}
        dateFormat="dd/MM/yyyy"
        dropdownMode="select"
        showMonthDropdown
        showYearDropdown
        onChange={(date: Date) => setBirthday(date)}
      />
      <p>
        Welcome to your new <strong>{site.siteMetadata.title}</strong> site.
      </p>
      <p>{closestIndex}</p>
    </Layout>
  );
}

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allJojoVolume {
      nodes {
        id
        volume
        english_title
        japanese_title
        release_date
        cover
      }
    }
  }
`;
