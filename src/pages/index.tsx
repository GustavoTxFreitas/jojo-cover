import React, { useState, useEffect, ChangeEvent } from "react";
import { graphql } from "gatsby";
import DatePicker, {registerLocale } from "react-datepicker"
import { Carousel } from "react-responsive-carousel";
import Layout from "../layouts";
import i18n from "../components/i18next";
import { useTranslation } from "react-i18next";
import { ptBR, ja, enUS } from 'date-fns/esm/locale'
import i18next from "i18next";

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
  const { t } = useTranslation("translation", { i18n });

  registerLocale('pt-BR', ptBR)
  registerLocale('en-US', enUS)
  registerLocale('ja', ja)

  useEffect(() => {
    let closestDay = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < jojos.length; i++) {
      const diff = Math.abs(
        birthday.getTime() - new Date(jojos[i].release_date).getTime()
      );

      if (diff < closestDay) {
        closestDay = diff;
        setClosestIndex(i);
      } else if (diff > closestDay) {
        break;
      }
    }
  }, [birthday]);

  function handleChangeLanguage(e: ChangeEvent<HTMLSelectElement>)
  {
    i18next.changeLanguage(e.target.value);
  }

  return (
    <Layout title={t("siteName")} footerMessage={t("helpme")}>
      <select onChange={handleChangeLanguage}>
        <option value="en-US">en-US</option>
        <option value="pt-BR">pt-BR</option>
        <option value="ja">ja</option>
      </select>
      <DatePicker
        locale={t("locale")}
        placeholderText={t("datePlaceholder")}
        selected={birthday}
        dropdownMode="select"
        dateFormat="P"
        showMonthDropdown
        showYearDropdown
        onChange={(date: Date) => setBirthday(date)}
      />
      <Carousel
        width="700px"
        showThumbs={false}
        showIndicators={false}
        selectedItem={closestIndex}
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
