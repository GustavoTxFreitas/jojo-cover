import React from "react";
import style from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.credits}>
        <div className={style.message}>
          © {new Date().getFullYear()}, Built with{" "}
          <a href="https://www.gatsbyjs.org">Gatsby</a>{" "}
        </div>
        <div className={style.message}>
          Data from{" "}
          <a href="https://jojowiki.com/JoJo_Wiki">
            Jojo's Bizarre Encyclopedia
          </a>{" "}
        </div>
      </div>
      <div className={style.contact}>
        <div className={style.message}>
          Help me improve this project!{" "}
          <a href="https://github.com/sinayra/jojo-cover">Jojo Cover project</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
