import React from 'react'
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap"


import { Pencil, ArrowRight, CheckLg } from 'react-bootstrap-icons'
import styles from "../../styles/Profile.module.css"
import UserLayout from '../../components/UserLayout'
import Profpict from "../../assets/img/default-pict.png"
import { getUserDataAction } from '../../redux/actionCreators/userData';
import { logoutAction } from "../../redux/actionCreators/auth";

export default function Profile() {
  const [loading, setLoading] = useState(false)
  const [previewImg, setPreviewImg] = useState(null)
  const [image, setImage] = useState(null)
  const [isError, setIsError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [msg, setMsg] = useState("")
  const [showLogout, setShowLogout] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()
  const { data, isLoading } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)

  const updateImgHandler = async () => {
    try {
      setIsSuccess(false)
      setLoading(true)
      setIsError(false)
      const { token } = data
      const body = new FormData()
      body.append('image', image)
      const config = { headers: { Authorization: `Bearer ${token}`, "content-type": "multipart/form-data" } }
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_BE_HOST}/user/image/${userData.id}`, body, config)
      setLoading(false)
      setPreviewImg(null)
      setMsg("Image Updated!")
      setIsSuccess(true)
    } catch (error) {
      setIsSuccess(false)
      setIsError(true)
      setMsg(error.response.data.msg)
      setLoading(false)
      setPreviewImg(null)
    }
  }

  useEffect(() => {
    dispatch(getUserDataAction(data.id, data.token))
  }, [msg])

  const logoutHandler = async () => {
    try {
      setLoading(true)
      const { token } = data
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}/auth/logout`, config)
      dispatch(logoutAction())
      setLoading(false)
      setShowLogout(false)
      router.push('/')
    } catch (error) {
      setLoading(false)
    }
  }
  return (
    <>
      {isLoading && <Loading />}
      <UserLayout title={"Profile"}>
        <main className={styles.mainContainer}>
          <section className={styles.profileCard}>
            <div className={styles.profPictContainer}>
              <Image src={previewImg !== null ? previewImg :
                userData.image !== null ? `${process.env.NEXT_PUBLIC_CLOUDINARY}${userData.image}` :
                  Profpict} className={styles.profPict} width={'150px'} height={'150px'} />
            </div>
            <div className={styles.editSaveContainer}>
              {previewImg === null ?
              <label htmlFor='pict' className={styles.editContainer}>
                <Pencil className={styles.icon} />
                <input type="file" name="pict" id="pict"
                  onChange={e => {
                    setIsError(false)
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = () => {
                        setPreviewImg(reader.result)
                        setImage(file)
                      }
                      reader.readAsDataURL(file)
                    }
                  }} />
                <div className={styles.edit}>Edit</div>
              </label>:
              <div className={styles.editContainer} onClick={updateImgHandler}>Save Change</div>
              }
            </div>
            {loading ?  <Spinner animation="border" size="sm" /> : <></>}
            {isError ? <div className={styles.error}>{msg}</div> : <></>}
            {isSuccess ? <div className={styles.success}>{msg}</div> : <></>}
            <div className={styles.name}>{`${userData.firstName} ${userData.lastName}`}</div>
            <div className={styles.phone}>{userData.noTelp ? userData.noTelp : 'Phone'}</div>
            <div className={styles.menuContainer}>
              <div className={styles.menu}
                onClick={() => router.push('/profile/info')}
              >
                <div className="title">Personal Information</div>
                <ArrowRight className={styles.icon} />
              </div>
              <div className={styles.menu}
              onClick={() => router.push('/profile/changepass')}
              >
                <div className="title">Change Password</div>
                <ArrowRight className={styles.icon} />
              </div>
              <div className={styles.menu}
              onClick={() => router.push('/profile/changepin')}
              >
                <div className="title">Change PIN</div>
                <ArrowRight className={styles.icon} />
              </div>
              <div className={styles.menu}
                onClick={() => setShowLogout(true)}
              >
                <div className="title">Logout</div>
                {/* <ArrowRight className={styles.icon}/> */}
              </div>
            </div>
          </section>
        </main>
      </UserLayout>
      <Modal show={showLogout} size="s" centered className="modal">
        <Modal.Title className={styles.modaltitle}>
        LOG OUT
            </Modal.Title>
        <Modal.Body className={styles.modalcontent}>
            <p>
            Are you sure you want to log out?
            </p>
        </Modal.Body>
        <div className={styles.modalfooter}>
            <button className={styles.modalbuttonclose} onClick={() => setShowLogout(false)}>
                Back
            </button>
            <button className={styles.modalbutton} onClick={logoutHandler}>
                Log Out
            </button>
        </div>
      </Modal>
    </>
  )
}
