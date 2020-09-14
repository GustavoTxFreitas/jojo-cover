import React, { useState, useEffect, ChangeEvent } from "react";
import i18n from "./i18next";
import { useTranslation } from "react-i18next";
import { ptBR, ja, enUS } from "date-fns/esm/locale";
import { registerLocale } from "react-datepicker";
import i18next from "i18next";
import { Link } from "gatsby";

import style from "./header.module.css";

interface Props {
  siteName: string;
  setSiteName: (arg0: string) => void;
  setLocale: (arg0: string) => void;
  setHelpme: (arg0: string) => void;
  setDatePlaceholder: (arg0: string) => void;
  setLoading: (arg0: string) => void;
}

const Header = ({
  siteName,
  setSiteName,
  setLocale,
  setHelpme,
  setDatePlaceholder,
  setLoading,
}: Props) => {
  const { t } = useTranslation("translation", { i18n });

  function handleChangeLanguage(e: ChangeEvent<HTMLSelectElement>) {
    i18next.changeLanguage(e.target.value);

    setSiteName(t("siteName"));
    setLocale(t("locale"));
    setHelpme(t("helpme"));
    setDatePlaceholder(t("datePlaceholder"));
    setLoading(t("loading"));
  }

  registerLocale("pt-BR", ptBR);
  registerLocale("en-US", enUS);
  registerLocale("ja", ja);

  useEffect(() => {
    setSiteName(t("siteName"));
    setLocale(t("locale"));
    setHelpme(t("helpme"));
    setDatePlaceholder(t("datePlaceholder"));
    setLoading(t("loading"));
  }, [])

  return (
    <header className={style.header}>
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {siteName}
        </Link>
      </h3>

      <select onChange={handleChangeLanguage}>
        <option value="en-US">en-US</option>
        <option value="pt-BR">pt-BR</option>
        <option value="ja">ja</option>
      </select>
    </header>
  );
};

export default Header;
