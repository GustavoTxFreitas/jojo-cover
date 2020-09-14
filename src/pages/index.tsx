import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import DatePicker from "react-datepicker";
import { Carousel } from "react-responsive-carousel";
import Layout from "../layouts";
import style from "./index.module.css";

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
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [closestIndex, setClosestIndex] = useState(0);

  const [siteName, setSiteName] = useState("");
  const [datePlaceholder, setDatePlaceholder] = useState("");
  const [loading, setLoading] = useState("");
  const [locale, setLocale] = useState("en-US");
  const [helpme, setHelpme] = useState("");


  useEffect(() => {
    function calculateClosestVolume(date: Date){
      let closestDay = Number.MAX_SAFE_INTEGER;
      for (let i = 0; i < jojos.length; i++) {
        const diff = Math.abs(
          date.getTime() - new Date(jojos[i].release_date).getTime()
        );

        if (diff < closestDay) {
          closestDay = diff;
          setClosestIndex(i);
        } else if (diff > closestDay) {
          break;
        }
      }
    }

    if(birthday)
    {
      calculateClosestVolume(birthday)
    }
    
  }, [birthday]);

  return (
    <Layout
      siteName={siteName}
      helpme={helpme}
      setSiteName={setSiteName}
      setLoading={setLoading}
      setHelpme={setHelpme}
      setDatePlaceholder={setDatePlaceholder}
      setLocale={setLocale}
    >
      <div className={style.content}>
        <DatePicker
          locale={locale}
          placeholderText={datePlaceholder}
          selected={birthday}
          dropdownMode="select"
          dateFormat="P"
          showMonthDropdown
          showYearDropdown
          onChange={(date: Date) => setBirthday(date)}
        />
        {birthday ? (
          <div className={style.cover}>
            <Carousel
              showThumbs={false}
              showIndicators={false}
              selectedItem={closestIndex}
              showStatus={false}
              centerMode
              centerSlidePercentage={80}
            >
              {jojos.map((elem) => (
                <div key={elem.id}>
                  <img src={elem.cover} />
                  <p className="legend">
                    {elem.volume} - {elem.english_title}
                  </p>
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <p></p>
        )}
      </div>
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
