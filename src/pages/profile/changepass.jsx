import React from 'react'
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";


import { Lock, Eye, EyeSlash } from 'react-bootstrap-icons'
import Loading from '../../components/Loading';
import styles from "../../styles/Profile.module.css"
import UserLayout from '../../components/UserLayout'
import { getUserDataAction } from '../../redux/actionCreators/userData';

export default function ChangePass() {
  const [isPassShown, setIsPassShown] = useState(false)
  const [isPassShown2, setIsPassShown2] = useState(false)
  const [isPassShown3, setIsPassShown3] = useState(false)
  const [password, setPassword] = useState("")
  const [passFilled, setPassFilled] = useState(false)
  const [password2, setPassword2] = useState("")
  const [passFilled2, setPassFilled2] = useState(false)
  const [password3, setPassword3] = useState("")
  const [passFilled3, setPassFilled3] = useState(false)
  const [buttonActive, setButtonActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(null)
  const [msg, setMsg] = useState("")


  const router = useRouter()
  const dispatch = useDispatch()
  const { data, isLoading } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)

  const showPassHandler = () => {
    setIsPassShown(!isPassShown)
  }
  const showPassHandler2 = () => {
    setIsPassShown2(!isPassShown2)
  }
  const showPassHandler3 = () => {
    setIsPassShown3(!isPassShown3)
  }

  const updatePassHandler = async () => {
    try {
      setLoading(true)
      setIsError(null)
      const { token } = data
      const oldPassword = password
      const newPassword = password2
      const confirmPassword = password3
      const body = { oldPassword, newPassword, confirmPassword }
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_BE_HOST}/user/password/${userData.id}`, body, config)
      console.log(response)
      setIsError(false)
      setMsg(response.data.msg)
      setLoading(false)
    } catch (error) {
      setIsError(true)
      setMsg(error.response.data.msg)
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    setPassFilled(password)
    setPassFilled2(password2)
    setPassFilled3(password3)
    setButtonActive(password && password2 && password3)
  }, [password, password2, password3])
  return (
    <>
      {loading && <Loading />}
      {isLoading && <Loading />}
      <UserLayout title={"Profile"}>
        <main className={styles.mainContainer}>
          <section className={styles.infoCard}>
            <div className={styles.title}>
              Change Password
            </div>
            <div className={styles.info}>
            You must enter your current password and then type your new password twice.
            </div>
            <section className={styles.passContainer}>
              <div className={`${styles.inputContainer} ${passFilled ? styles.borderActive : styles.borderInactive}`}>
                <label htmlFor="pass">
                  <Lock className={passFilled ? styles.iconActive : styles.icon} />
                  <input type={isPassShown ? "text" : "password"} id="pass" placeholder="Current password"
                    onChange={e => setPassword(e.target.value)}
                  />
                  {isPassShown ? <Eye className={`${passFilled ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler} /> : <EyeSlash className={`${passFilled ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler} />}
                </label>
              </div>
              <div className={`${styles.inputContainer} ${passFilled2 ? styles.borderActive : styles.borderInactive}`}>
                <label htmlFor="pass">
                  <Lock className={passFilled2 ? styles.iconActive : styles.icon} />
                  <input type={isPassShown2 ? "text" : "password"} id="pass" placeholder="Create new password"
                    onChange={e => setPassword2(e.target.value)}
                  />
                  {isPassShown2 ? <Eye className={`${passFilled2 ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler2} /> : <EyeSlash className={`${passFilled2 ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler2} />}
                </label>
              </div>
              <div className={`${styles.inputContainer} ${passFilled3 ? styles.borderActive : styles.borderInactive}`}>
                <label htmlFor="pass">
                  <Lock className={passFilled3 ? styles.iconActive : styles.icon} />
                  <input type={isPassShown3 ? "text" : "password"} id="pass" placeholder="Confirm new password"
                    onChange={e => setPassword3(e.target.value)}
                  />
                  {isPassShown3 ? <Eye className={`${passFilled3 ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler3} /> : <EyeSlash className={`${passFilled3 ? styles.iconActive : styles.icon} ${styles.eye}`} onClick={showPassHandler3} />}
                </label>
              </div>
              {isError === null ? <></> :
                isError ?
                  <div className={styles.errorMsg}>{msg}</div>
                  : <div className={styles.successMsg}>{msg}</div>}
              {buttonActive ?
                <div className={styles.button} onClick={updatePassHandler}>Change Password</div>
                :
                <div className={styles.buttonInactive} >Change Password</div>
              }
            </section>
          </section>
        </main>
      </UserLayout>
    </>
  )
}
