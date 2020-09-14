import React from "react";

interface Props {
    helpme: string;
}

const Footer = ({ helpme }: Props) => {
  return (
    <footer>
      © {new Date().getFullYear()}, Built with
      {` `}
      <a href="https://www.gatsbyjs.org">Gatsby</a> {helpme}
    </footer>
  );
};

export default Footer;
