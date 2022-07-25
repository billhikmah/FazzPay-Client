import SignupAside from "../../../components/SignupAside";
import Link from 'next/link'
import Head from "next/head"
import axios from "axios";
import { useState, useEffect } from "react";
import { Person, Envelope, Lock, Eye, EyeSlash } from 'react-bootstrap-icons'
import styles from '../../../styles/Signup.module.css'
import Loading from '../../../components/Loading';

export default function Forgot() {
  const [isPassShown, setIsPassShown] = useState(false)
  const [isConfirmPassShown, setIsConfirmPassShown] = useState(false)
  const [email, setEmail] = useState("")
  const [emailFilled, setEmailFilled] = useState(false)
  const [password, setPassword] = useState("")
  const [passFilled, setPassFilled] = useState(false)
  const [buttonActive, setButtonActive] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(null)
  const [msg, setMsg] = useState("")

  const forgotPassHandler = async() => {
    try {
      setIsError(null)
      setMsg("")
      setIsLoading(true)
      let linkDirect = `${process.env.NEXT_PUBLIC_FE_HOST}/auth/reset`
      let body = { email, linkDirect }
      let response = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}/auth/forgot-password`, body)
      setIsError(false)
      setMsg(response.data.msg)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      // setMsg(error.response.data.msg)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setEmailFilled(email)
    setButtonActive(email)
  }, [email, password, isError, isLoading])

  return (
    <>
    <Head>
        <title>
          Create Pin
        </title>
      </Head>
    <main className={styles.globalContainer}>
      {isLoading && <Loading />}
      <SignupAside />
      <section className={styles.mainContainer}>
        <div className={styles.mainLogo}>FazzPay</div>
        <div className={styles.title}>
          Did You Forgot Your Password? Don't Worry, You Can Reset Your Password In a Minutes.
        </div>
        <div className={styles.info}>
          To reset your password, you must type your e-mail and we will send a link to your email and you will be directed to the reset password screens.
        </div>
            <div className={`${styles.inputContainer} ${emailFilled ? styles.borderActive : styles.borderInactive}`}>
              <label htmlFor="email">
                <Envelope className={emailFilled ? styles.iconActive : styles.icon} />
                <input type="text" id="email" placeholder="Enter your email" 
                onChange={e => setEmail(e.target.value)}
                />
              </label>
            </div>
            {isError === null ? <></> : isError ? <div className={styles.errorMsg}>{msg}</div> : <div className={styles.successMsg}>{msg}</div>}
            {buttonActive ?
            <div className={styles.button} onClick={forgotPassHandler}>Confirm</div>
            :
            <div className={styles.buttonInactive} >Confirm</div>
          }    
      </section>
    </main>
            </>
  )
}
