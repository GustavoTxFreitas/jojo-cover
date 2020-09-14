import React from "react";
import style from "./footer.module.css";

interface Props {
    helpme: string;
}

const Footer = ({ helpme }: Props) => {
  return (
    <footer className={style.footer}>
      <div className={style.credits}>
        <div className={style.message}>© {new Date().getFullYear()}, Built with <a href="https://www.gatsbyjs.org">Gatsby</a> </div>
        <div className={style.message}>Data from <a href="https://jojo.fandom.com/wiki/Main_Page">Jojo's bizarre -Wiki- Adventure</a> </div>
      </div>
      <div className={style.contact}>
        <div className={style.message}>{helpme}</div>
        <div className={style.github}><a href="https://github.com/sinayra/jojo-cover">Jojo Cover project</a> </div>
      </div>
    </footer>
  );
};

export default Footer;
