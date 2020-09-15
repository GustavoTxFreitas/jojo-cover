import React, { useEffect } from "react";
import i18n from "./i18next";
import { useTranslation } from "react-i18next";
import { ptBR, ja, enUS } from "date-fns/esm/locale";
import { registerLocale } from "react-datepicker";
import i18next from "i18next";
import Select, { OptionsType  } from "react-select";

import style from "./header.module.css";

interface Props {
  siteName: string;
  setSiteName: (arg0: string) => void;
  setLocale: (arg0: string) => void;
  setHelpme: (arg0: string) => void;
  setDatePlaceholder: (arg0: string) => void;
  setLoading: (arg0: string) => void;
}

interface Option {
  value: string;
  label?: any;
  action?: any;
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

  function handleChangeLanguage(locale: string) {
    i18next.changeLanguage(locale);

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
  }, []);

  const options = [
    {
      value: "en-US",
      label: (
        <div style={{fontFamily: `'Roboto', sans-serif`} }>
          <img className={style.icon} src="./usa.png" /> USA
        </div>
      ),
    },
    {
      value: "pt-BR",
      label: (
        <div style={{fontFamily: `'Roboto', sans-serif`} }>
          <img className={style.icon}  src="./brazil.png" /> PT-BR
        </div>
      ),
    },
    {
      value: "ja",
      label: (
        <div style={ {fontFamily: `'Noto Sans JP', sans-serif`} }>
          <img className={style.icon} src="./japan.png" /> JP
        </div>
      ),
    },
  ];

  return (
    <header className={style.header}>

      <Select
        className={style.language_container}
        classNamePrefix={style.language}
        defaultValue={options[0]}
        options={options}
        onChange={(e) => {
          handleChangeLanguage((e as Option).value);
        }}
      />
    </header>
  );
};

export default Header;
