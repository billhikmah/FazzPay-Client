import SignupAside from "../../../components/SignupAside";
import Link from 'next/link'
import Head from "next/head"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactCodeInput from 'react-code-input'
import axios from "axios";
import Loading from '../../../components/Loading';
import styles from '../../../styles/Signup.module.css'
import { Check2 } from "react-bootstrap-icons";

export default function Login() {
  const [pinCode, setPinCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [msg, setMsg] = useState("")

  const { data } = useSelector(state => state.auth)
  const handlePinChange = e => {
    setPinCode(e);
  };

  useEffect(() => {

  }, [])

  const createPinHandler = async () => {
    try {
      setIsLoading(true)
      const { token } = data
      const body = { pin: pinCode }
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_BE_HOST}/user/pin/${data.id}`, body, config)
      setMsg(response.data.msg)
      setIsSuccess(true)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }
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
        {isSuccess ?
          <section className={`${styles.mainContainer} ${styles.pinSuccess}`}>
            <div className={styles.mainLogo}>FazzPay</div>
            <div className={styles.checkContainer}><Check2 /></div>
            <div className={styles.title}>
              Your PIN Was Successfully Created
            </div>
            <div className={styles.info}>
              Your PIN was successfully created and you can now access all the features in FazzPay.
            </div>
            <Link href={"/dashboard"}>
              <div className={styles.button}>Go To Dashboard</div>
            </Link>
          </section>
          :
          <section className={styles.mainContainer}>
            <div className={styles.mainLogo}>FazzPay</div>
            <div className={styles.title}>
              Secure Your Account, Your Wallet, and Your Data With 6 Digits PIN That You Created Yourself.
            </div>
            <div className={styles.info}>
              Create 6 digits pin to secure all your money and your data in FazzPay app. Keep it secret and don't tell anyone about your FazzPay account password and the PIN.
            </div>
            <div className={styles.pinContainer}>
              <ReactCodeInput type="number" fields={6} className={styles.reactCodeInput}
                onChange={handlePinChange}
              />
            </div>
            <div className={styles.button}
              onClick={createPinHandler}>Confirm</div>
          </section>
        }
      </main>
    </>
  )
}
