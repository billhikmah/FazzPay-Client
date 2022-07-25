import { useRouter, withRouter } from 'next/router'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Spinner } from "react-bootstrap";
import Head from "next/head"
import SignupAside from "../../../components/SignupAside";
import styles from '../../../styles/Signup.module.css'
import Link from 'next/link'
import { Envelope, Lock, Eye, EyeSlash } from 'react-bootstrap-icons'
// import axios from "axios";
import { loginAction } from "../../../redux/actionCreators/auth";
import Loading from '../../../components/Loading';

function Login() {
  const [isPassShown, setIsPassShown] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailFilled, setEmailFilled] = useState(false)
  const [passFilled, setPassFilled] = useState(false)
  const [buttonActive, setButtonActive] = useState(false)
  const [isShow, setIsShow] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()
  const { isError, isLoading, message, data } = useSelector(state => state.auth)
  useEffect(() => {
    setEmailFilled(email)
    setPassFilled(password)
    setButtonActive(email && password)
    if (isError === false) {
      (data.pin ? router.push('/dashboard') : router.push('/auth/pin'))
    }
  }, [email, password, isError, isLoading])

  const loginHandler = () => {
    let body = { email, password }
    dispatch(loginAction(body))
  }

  const showPassHandler = () => {
    setIsPassShown(!isPassShown)
  }
  return (
    <>
      <Head>
        <title>
          Login
        </title>
      </Head>
      <main className={styles.globalContainer}>
        <SignupAside />
        <section className={styles.mainContainer}>
          <div className={styles.mainLogo}><Link href={"/"}>FazzPay</Link></div>
          <div className={styles.title}>
            Start Accessing Banking Needs With All Devices and All Platforms With 30.000+ Users
          </div>
          <div className={styles.info}>
            Transfering money is eassier than ever, you can access FazzPay wherever you are. Desktop, laptop, mobile phone? we cover all of that for you!
          </div>
          <div className={`${styles.inputContainer} ${emailFilled ? styles.borderActive : styles.borderInactive}`}>
            <label htmlFor="email">
              <Envelope className={emailFilled ? styles.iconActive : styles.icon} />
              <input type="text" id="email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} />
            </label>
          </div>
          <div className={`${styles.inputContainer} ${passFilled ? styles.borderActive : styles.borderInactive}`}>
            <label htmlFor="pass">
              <Lock className={passFilled ? styles.iconActive : styles.icon} />
              <input type={isPassShown ? "text" : "password"} id="pass" placeholder="Enter your password" onChange={e => setPassword(e.target.value)} />
              {isPassShown ? <Eye className={`${passFilled ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler} /> : <EyeSlash className={`${passFilled ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler} />}
            </label>
          </div>

          <div className={styles.forgot}><Link href={'/auth/forgot'}>Forgot password?</Link></div>

          {isError === null ? <></> : isError ? <div className={styles.errorMsg}>{message}</div> : <div className={styles.successMsg}></div>}
          {buttonActive ?
            <div className={styles.button} onClick={loginHandler}>{!isLoading ? "Login" : 
              <Spinner animation="border" variant="light" />}</div> :
            <div className={styles.buttonInactive}>Login</div>
          }
          <div className={styles.login}>Don't have an account? Let's <Link href={'/auth/signup'}>Sign Up</Link></div>
        </section>
        <Modal
          show={isShow}
          onHide={() => setIsShow(false)}>
          <Modal.Header>
            {isLoading ? "Processing, Please wait" : message}
          </Modal.Header>
        </Modal>
      </main>
    </>
  )
}

export default withRouter(Login)