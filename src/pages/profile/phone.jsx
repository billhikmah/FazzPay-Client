import React from 'react'
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";


import { Telephone } from 'react-bootstrap-icons'
import Loading from '../../components/Loading';
import styles from "../../styles/Profile.module.css"
import UserLayout from '../../components/UserLayout'
import { getUserDataAction } from '../../redux/actionCreators/userData';

export default function Information() {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [phoneFilled, setPhoneFilled] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isError, setIsError] = useState(null)
  const [msg, setMsg] = useState("")


  const router = useRouter()
  const dispatch = useDispatch()
  const { data, isLoading } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)

  const phoneValidate = () => {
    const regex = new RegExp('^[0-9]+$')
    if (!regex.test(phone)) {
      setIsError(true)
      setMsg("Phone Number Invalid")
      throw new Error
    }
  }

  const updatePhoneHandler = async () => {
    try {
      setLoading(true)
      setIsError(null)
      setMsg('')
      phoneValidate()
      const { token } = data
      const noTelp = phone
      const body = { noTelp }
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_BE_HOST}/user/profile/${userData.id}`, body, config)
      console.log(response)
      setIsError(false)
      setMsg(response.data.msg)
      setIsEdit(false)
      setLoading(false)
    } catch (error) {
      setIsError(true)
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    setPhoneFilled(phone)
    setIsError(false)
    setMsg("")
  }, [phone])
  return (
    <>
      {loading && <Loading />}
      {isLoading && <Loading />}
      <UserLayout title={"Profile"}>
        <main className={styles.mainContainer}>
          <section className={styles.infoCard}>
            <div className={styles.title}>
              Edit Phone Number
            </div>
            <div className={styles.info}>
              Add at least one phone number for the transfer ID so you can start transfering your money to another user.
            </div>
            <section className={styles.phoneContainer}>
              <label htmlFor='phone' className={`${styles.inputContainer} ${phoneFilled ? styles.inputActive : styles.inputInactive}`}>
                <Telephone className={`${phoneFilled ? styles.icon : styles.iconInactive}`} />
                <div className={styles.indo}>+62</div>
                <input type="text" name="phone" id="phone" placeholder='Enter your phone number'
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              {isError ? <div className={styles.errorMsg}>{msg}</div> : <div className={styles.successMsg}>{msg}</div>}
              {phoneFilled ?
                <div className={styles.confirmButton} onClick={updatePhoneHandler}>Edit Phone Number</div>
                :
                <div className={styles.confirmButtonInactive}>Edit Phone Number</div>
              }
            </section>
          </section>
        </main>
      </UserLayout>
    </>
  )
}
