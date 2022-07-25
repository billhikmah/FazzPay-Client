import React from 'react'
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";


import ReactCodeInput from 'react-code-input'
import { Telephone } from 'react-bootstrap-icons'
import Loading from '../../components/Loading';
import styles from "../../styles/Profile.module.css"
import UserLayout from '../../components/UserLayout'
import { getUserDataAction } from '../../redux/actionCreators/userData';

export default function ChangePin() {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState("check")
  const [pin, setPin] = useState('')
  const [isError, setIsError] = useState(null)
  const [msg, setMsg] = useState("")

  const router = useRouter()
  const dispatch = useDispatch()
  const { data, isLoading } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)

  const handlePinChange = e => {
    setPin(e);
  };

  const updatePinHandler = async () => {
    try {
      setLoading(true)
      setIsError(null)
      const { token } = data
      const body = { pin }
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_BE_HOST}/user/pin/${userData.id}`, body, config)
      console.log(response)
      setIsError(false)
      setMsg(response.data.msg)
      setPage('check')
      setLoading(false)
    } catch (error) {
      setIsError(true)
      console.log(error)
      setLoading(false)
    }
  }

  const checkPinHandler = async () => {
    try {
      setLoading(true)
      setIsError(null)
      const { token } = data
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}/user/pin?pin=${pin}`, config)
      setIsError(false)
      setMsg(response.data.msg)
      setPage('update')
      setLoading(false)
    } catch (error) {
      setIsError(true)
      setMsg(error.response.data.msg)
      setMsg("Wrong Pin")
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    setMsg('')
  }, [pin])

  return (
    <>
      {loading && <Loading />}
      {isLoading && <Loading />}
      <UserLayout title={"Profile"}>
        <main className={styles.mainContainer}>
          <section className={styles.infoCard}>
            <div className={styles.title}>
              Change PIN
            </div>
            <div className={styles.info}>
              {page === 'check' ?
                'Enter your current 6 digits Zwallet PIN below to continue to the next steps.'
                : 'Type your new 6 digits security PIN to use in Zwallet.'
              }</div>
            <section className={styles.pinContainer}>
              {page === 'check' ?
                <>
                  <div className={styles.title}>Check Pin</div>
                  <ReactCodeInput type="number" fields={6} className={styles.reactCodeInput}
                    onChange={handlePinChange}
                  />
                </>
                :
                <>
                  <div className={styles.title}>Create New Pin</div>
                  <ReactCodeInput type="number" fields={6} className={styles.reactCodeInput}
                    onChange={handlePinChange}
                  />
                </>
              }
              {isError === null ? <></> :
                isError === true ?
                  <div className={styles.errorMsg}>{msg}</div>
                  :
                  <div className={styles.successMsg}>{msg}</div>
              }

              {page === 'check' ?
                pin.length === 6 ?
                  <div className={styles.button} onClick={checkPinHandler}>Continue</div>
                  :
                  <div className={styles.buttonInactive} >Continue</div>
                :
                pin.length === 6 ?
                  <div className={styles.button} onClick={updatePinHandler}>Change Pin</div>
                  :
                  <div className={styles.buttonInactive} >Change Pin</div>
              }
            </section>
          </section>
        </main>
      </UserLayout>
    </>
  )
}
