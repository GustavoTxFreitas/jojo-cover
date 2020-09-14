import React from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

interface Props {
  siteName: string;
  helpme: string;
  children?: any
  setSiteName: (arg0: string) => void;
  setLocale: (arg0: string) => void;
  setHelpme: (arg0: string) => void;
  setDatePlaceholder: (arg0: string) => void;
  setLoading: (arg0: string) => void;
}

const Layout = ({ siteName, helpme, setSiteName, setLoading, setLocale, setHelpme, setDatePlaceholder, children }: Props) => {

  return (
    <>
      <Header siteName={siteName} setLoading={setLoading} setSiteName={setSiteName} setLocale={setLocale} setHelpme={setHelpme} setDatePlaceholder={setDatePlaceholder} />
      <main>{children}</main>
      <Footer helpme={helpme}></Footer>
    </>
  )
}

export default Layout