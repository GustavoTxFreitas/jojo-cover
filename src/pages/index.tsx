import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import DatePicker from "react-datepicker";
import { Carousel } from "react-responsive-carousel";
import Layout from "../layouts";
import style from "./index.module.css";
import Img from "gatsby-image"

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
        cover: any;
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
    function calculateClosestVolume(date: Date) {
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

    if (birthday) {
      calculateClosestVolume(birthday);
    } 
  }, [birthday]);

  const font = locale === 'ja' ? `'Noto Sans JP', sans-serif` : `'Roboto', sans-serif`;

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
      <main className={style.content}>
        {birthday === null ? 
          <>
          <img src="/JOJOsvg.svg" className={style.bigLogo} /> 
            {
              locale !== 'en-US' ? 
              <p style={{fontFamily: font}}>({siteName})</p>
              : ""
            }
          </>
          : <div></div>}
        <div className={style.datepicker}>
          <DatePicker
            locale={locale}
            placeholderText={datePlaceholder}
            selected={birthday}
            dropdownMode="select"
            dateFormat="P"
            showMonthDropdown
            showYearDropdown
            onChange={(date: Date) => setBirthday(date)}
            popperPlacement="top-end"
          />
        </div>
        {birthday ? (
          <div className={[style.cover, style.fadein].join(' ')}>
            <Carousel
              className={style.carousel}
              showThumbs={false}
              showIndicators={false}
              selectedItem={closestIndex}
              showStatus={false}
              centerMode
              centerSlidePercentage={80}
            >
              {jojos.map((elem) => (
                <div key={elem.id} style={{maxHeight: '60vh'}}>
                  <Img
                    fixed={elem.cover.childImageSharp.fixed}
                    style={{maxHeight: '60vh'}}
                  />
                  <p className="legend" style={{fontFamily: font}}>
                    {elem.volume} -{" "}
                    {locale === "ja" ? elem.japanese_title : elem.english_title}{" "}
                    <br />
                    {new Date(elem.release_date).toLocaleDateString(locale)}
                  </p>
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <p></p>
        )}
      </main>
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
        cover {
          childImageSharp {
            fixed(height: 600) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`;
