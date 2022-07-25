import SignupAside from "../../../components/SignupAside";
import styles from '../../../styles/Signup.module.css'
import Link from 'next/link'
import Head from "next/head"
import { Person, Envelope, Lock, Eye, EyeSlash } from 'react-bootstrap-icons'
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loading from '../../../components/Loading';
import { Modal, Button } from "react-bootstrap";

export default function Signup() {
  const [isPassShown, setIsPassShown] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstNameFilled, setFirstNameFilled] = useState(false)
  const [lastNameFilled, setLastNameFilled] = useState(false)
  const [emailFilled, setEmailFilled] = useState(false)
  const [passFilled, setPassFilled] = useState(false)
  const [buttonActive, setButtonActive] = useState(false)
  const [isError, setIsError] = useState(null)
  const [msg, setMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isShow, setIsShow] = useState(false)


  const router = useRouter()

  useEffect(() => {
    setEmailFilled(email)
    setPassFilled(password)
    setFirstNameFilled(firstName)
    setLastNameFilled(lastName)
    setButtonActive(email && password && firstName && lastName)
  }, [email, password, firstName, lastName])
  const showPassHandler = () => {
    setIsPassShown(!isPassShown)
  }
  const signUpHandler = async () => {
    try {
      setIsError(null)
      setMsg("")
      setIsLoading(true)
      let body = { firstName, lastName, email, password }
      let response = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}/auth/register`, body)
      setMsg(response.data.msg)
      setIsLoading(false)
      setIsShow(true)
      // router.push("/auth/login")
    } catch (error) {
      setIsError(true)
      setMsg(error.response.data.msg)
      console.log(error);
      setIsLoading(false)
    }
  }
  const handleClose = () => {
    setIsShow(false)
    router.push("/auth/login")
  };
  return (
    <>
      <Head>
        <title>
          Sign Up
        </title>
      </Head>
      <main className={styles.globalContainer}>
        {isLoading && <Loading />}
        <SignupAside />
        <section className={styles.mainContainer}>
          <div className={styles.mainLogo}>FazzPay</div>
          <div className={styles.title}>
            Start Accessing Banking Needs With All Devices and All Platforms With 30.000+ Users
          </div>
          <div className={styles.info}>
            Transfering money is eassier than ever, you can access FazzPay wherever you are. Desktop, laptop, mobile phone? we cover all of that for you!
          </div>
          <div className={`${styles.inputContainer} ${firstNameFilled ? styles.borderActive : styles.borderInactive}`}>
            <label htmlFor="first-name">
              <Person className={firstNameFilled ? styles.iconActive : styles.icon} />
              <input type="text" id="first-name" placeholder="Enter your first name"
                onChange={e => setFirstName(e.target.value)}
              />
            </label>
          </div>
          <div className={`${styles.inputContainer} ${lastNameFilled ? styles.borderActive : styles.borderInactive}`}>
            <label htmlFor="last-name">
              <Person className={lastNameFilled ? styles.iconActive : styles.icon} />
              <input type="text" id="last-name" placeholder="Enter your last name"
                onChange={e => setLastName(e.target.value)}
              />
            </label>
          </div>
          <div className={`${styles.inputContainer} ${emailFilled ? styles.borderActive : styles.borderInactive}`}>
            <label htmlFor="email">
              <Envelope className={emailFilled ? styles.iconActive : styles.icon} />
              <input type="text" id="email" placeholder="Enter your email"
                onChange={e => setEmail(e.target.value)}
              />
            </label>
          </div>
          <div className={`${styles.inputContainer} ${passFilled ? styles.borderActive : styles.borderInactive}`}>
            <label htmlFor="pass">
              <Lock className={passFilled ? styles.iconActive : styles.icon} />
              <input type={isPassShown ? "text" : "password"} id="pass" placeholder="Enter your password"
                onChange={e => setPassword(e.target.value)}
              />
              {isPassShown ? <Eye className={`${passFilled ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler} /> : <EyeSlash className={`${passFilled ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler} />}
            </label>
          </div>
          {isError ? <div className={styles.errorMsg}>{msg}</div> : <></>}
          {buttonActive ?
            <div className={styles.button}
              onClick={signUpHandler}
            >Sign Up</div>
            :
            <div className={styles.buttonInactive}>Sign Up</div>
          }
          <div className={styles.login}>Already have an account? Let&apos;s <Link href={'/auth/login'}>Login</Link></div>
        </section>
        <Modal
          show={isShow}
          onHide={() => setIsShow(false)}>
          <Modal.Header className={styles.modalHeader}>
            <b>{msg}</b>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>Please check your email and verify your account before login</Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
            <Button variant="primary" onClick={handleClose} className={styles.modalPrimaryButton}>
              Login
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  )
}
