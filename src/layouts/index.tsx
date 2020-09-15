import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import style from './index.module.css'

interface Props {
  siteName: string
  helpme: string
  children?: any
  setSiteName: (arg0: string) => void
  setLocale: (arg0: string) => void
  setHelpme: (arg0: string) => void
  setDatePlaceholder: (arg0: string) => void
  setLoading: (arg0: string) => void
}

const Layout = ({
  siteName,
  helpme,
  setSiteName,
  setLoading,
  setLocale,
  setHelpme,
  setDatePlaceholder,
  children,
}: Props) => {
  
  return (
    <div className={style.container}>
      <Header
        siteName={siteName}
        setLoading={setLoading}
        setSiteName={setSiteName}
        setLocale={setLocale}
        setHelpme={setHelpme}
        setDatePlaceholder={setDatePlaceholder}
      />
      {children}
      <Footer helpme={helpme}></Footer>
    </div>
  )
}

export default Layout
