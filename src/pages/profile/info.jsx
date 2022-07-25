import React from 'react'
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";


import Loading from '../../components/Loading';
import styles from "../../styles/Profile.module.css"
import UserLayout from '../../components/UserLayout'
import { getUserDataAction } from '../../redux/actionCreators/userData';

export default function Information() {
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isEdit1, setIsEdit1] = useState(false)
  const [isEdit2, setIsEdit2] = useState(false)
  const [isError, setIsError] = useState(null)
  const [msg, setMsg] = useState("")


  const router = useRouter()
  const dispatch = useDispatch()
  const { data, isLoading } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)

  const updateNameHandler = async () => {
    try {
      setLoading(true)
      setIsError(null)
      const { token } = data
      const body = {firstName, lastName}
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_BE_HOST}/user/profile/${userData.id}`, body, config)
      setIsError(false)
      setMsg(response.data.msg)
      setIsEdit1(false)
      setIsEdit2(false)
      setLoading(false)
    } catch (error) {
      setIsError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    setFirstName(userData.firstName)
    setLastName(userData.lastName)
    dispatch(getUserDataAction(data.id, data.token))
  }, [isError])
  return (
    <>
      {loading && <Loading />}
      {isLoading && <Loading />}
      <UserLayout title={"Profile"}>
        <main className={styles.mainContainer}>
          <section className={styles.infoCard}>
            <div className={styles.title}>
              Personal Information
            </div>
            <div className={styles.info}>
              We got your personal information from the sign up proccess. If you want to make changes on your information, contact our support.
            </div>
            <div className={styles.cardContainer}>
              <div className={styles.editAction}>
              </div>
              <div className={styles.card}>
                <div className={styles.left}>
                  <div className={styles.title}>First Name</div>
                  {isEdit1 ?
                    <input type="text" name="first" id="first" placeholder={userData.firstName || "input your first name"} 
                    onChange={e => setFirstName(e.target.value)}
                    />
                    :
                    <div className={styles.value}>{userData.firstName}</div>
                  }
                </div>
                {isEdit1 ?
                  <>
                    <div className={styles.save} onClick={updateNameHandler}>Save</div>
                    <div className={styles.edit} onClick={() => setIsEdit1(false)}>Cancel</div>
                  </>
                  :
                  <div className={styles.edit} onClick={() => setIsEdit1(true)}>Edit</div>
                }
              </div>
              <div className={styles.card}>
                <div className={styles.left}>
                  <div className={styles.title}>Last Name</div>
                  {isEdit2 ?
                    <input type="text" name="first" id="first" placeholder={userData.lastName || "input your last name"} 
                    onChange={e => setLastName(e.target.value)}
                    />
                    :
                    <div className={styles.value}>{userData.lastName}</div>
                  }
                </div>
                {isEdit2 ?
                  <>
                    <div className={styles.save} onClick={updateNameHandler}>Save</div>
                    <div className={styles.edit} onClick={() => setIsEdit2(false)}>Cancel</div>
                  </>
                  :
                  <div className={styles.edit} onClick={() => setIsEdit2(true)}>Edit</div>
                }
              </div>
              <div className={styles.card}>
                <div className={styles.left}>
                  <div className={styles.title}>Verified E-mail</div>
                  <div className={styles.email}>{userData.email}</div>
                </div>
                {/* <div className={styles.manage}>Manage</div> */}
              </div>
              <div className={styles.card}>
                <div className={styles.left}>
                  <div className={styles.title}>Phone Number</div>
                  <div className={styles.value}>{userData.noTelp}</div>
                </div>
                <div className={styles.manage} onClick={()=> router.push('/profile/phone')}>Manage</div>
              </div>
            </div>
          </section>
        </main>
      </UserLayout>
    </>
  )
}
