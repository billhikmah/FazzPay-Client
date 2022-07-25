import SignupAside from "../../../components/SignupAside";
import Link from 'next/link'
import Head from "next/head"
import { useRouter } from 'next/router'
import axios from "axios";
import { useState, useEffect } from "react";
import { Person, Envelope, Lock, Eye, EyeSlash } from 'react-bootstrap-icons'
import styles from '../../../styles/Signup.module.css'
import Loading from '../../../components/Loading';

export default function Reset() {
  const [isPassShown, setIsPassShown] = useState(false)
  const [isConfirmPassShown, setIsConfirmPassShown] = useState(false)
  const [password, setPassword] = useState("")
  const [passFilled, setPassFilled] = useState(false)
  const [password2, setPassword2] = useState("")
  const [passFilled2, setPassFilled2] = useState(false)
  const [buttonActive, setButtonActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [msg, setMsg] = useState("")

  const router = useRouter()

  const showPassHandler = () => {
    setIsPassShown(!isPassShown)
  }
  const showConfirmPassHandler = () => {
    setIsConfirmPassShown(!isConfirmPassShown)
  }

  const resetPassHandler = async () => {
    try {
      setIsError(false)
      setIsSuccess(false)
      setMsg("")
      setIsLoading(true)
      let newPassword = password
      let confirmPassword = password2
      let keysChangePassword = router.query.key
      let body = { newPassword, confirmPassword, keysChangePassword }
      let response = await axios.patch(`${process.env.NEXT_PUBLIC_BE_HOST}/auth/reset-password`, body)
      setIsSuccess(true)
      setIsError(false)
      console.log(response)
      setMsg(response.data.msg)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      console.log(error)
      setMsg(error.response.data.msg)
      console.log(error);
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPassFilled(password)
    setPassFilled2(password2)
    setButtonActive(password && password2)
    // if (isError === false) {
    //   (data.pin ? router.push('/dashboard') : router.push('/auth/pin'))
    // }
  }, [password, password2, isError, isLoading])

  return (
    <>
      <Head>
        <title>
          Reset Password
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
          <div className={`${styles.inputContainer} ${passFilled ? styles.borderActive : styles.borderInactive}`}>
            <label htmlFor="pass">
              <Lock className={passFilled ? styles.iconActive : styles.icon} />
              <input type={isPassShown ? "text" : "password"} id="pass" placeholder="Create new password"
                onChange={e => setPassword(e.target.value)}
              />
              {isPassShown ? <Eye className={`${passFilled ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler} /> : <EyeSlash className={`${passFilled ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler} />}
            </label>
          </div>
          <div className={`${styles.inputContainer} ${passFilled2 ? styles.borderActive : styles.borderInactive}`}>
            <label htmlFor="pass">
              <Lock className={passFilled2 ? styles.iconActive : styles.icon} />
              <input type={isConfirmPassShown ? "text" : "password"} id="pass" placeholder="Confirm new password"
                onChange={e => setPassword2(e.target.value)}
              />
              {isConfirmPassShown ? <Eye className={`${passFilled2 ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showConfirmPassHandler} /> : <EyeSlash className={`${passFilled2 ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showConfirmPassHandler} />}
            </label>
          </div>
          {isError === null ? <></> :
            isError ?
              <>
                <div className={styles.forgot}><Link href={'/auth/forgot'}>Forgot password?</Link></div>
                <div className={styles.errorMsg}>{msg}</div>
              </>
              : <div className={styles.successMsg}>{msg}</div>}
          {!isSuccess ?
            buttonActive ?
              <div className={styles.button} onClick={resetPassHandler}>Reset Password</div>
              :
              <div className={styles.buttonInactive} >Reset Password</div>
            :
            <div className={styles.button} onClick={() => router.push('/auth/login')}>Login</div>

          }
        </section>
      </main>
    </>
  )
}
