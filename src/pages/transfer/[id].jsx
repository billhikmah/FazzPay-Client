import React from 'react'
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Link from 'next/link'
import { Modal, Button, Placeholder, Spinner } from "react-bootstrap"
import { Pencil, XLg, CheckLg, Download } from 'react-bootstrap-icons'
import ReactCodeInput from 'react-code-input'

import styles from "../../styles/Transfer.module.css"
import UserLayout from '../../components/UserLayout'
import Profpict from "../../assets/img/profile-placeholder.jpg"
import { currencyFormatter } from '../../helper/formatter';
import moment from 'moment';

export default function UserDetail() {
  const [title, setTitle] = useState("")
  const [page, setPage] = useState("process")
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState(moment().format('MMMM DD, YYYY - hh.mm'))
  const [notes, setNotes] = useState("")
  const [isNotesFilled, setIsNotesFilled] = useState(false)
  const [isAmountFilled, setIsAmountFilled] = useState(false)
  const [user, setUser] = useState([])
  const [showEnterPin, setShowEnterPin] = useState(false)
  const [pinCode, setPinCode] = useState("")
  const [transId, setTransId] = useState("")
  const [isError, setIsError] = useState(null)
  const [msg, setMsg] = useState("")
  const [url, setUrl] = useState("")
  const [showDownload, setShowDownload] = useState(false)

  const { data } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)
  const router = useRouter()

  const getUserDetail = async () => {
    try {
      setIsLoading(true)
      const { token } = data
      const { id } = router.query
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}/user/profile/${id}`, config)
      setUser(response.data.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handlePinChange = e => {
    setPinCode(e);
  };

  const transfer = async () => {
    try {
      setIsLoading(true)
      setIsError(null)
      const { token } = data
      const { id } = router.query
      const body = { receiverId: id, amount, notes }
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}/transaction/transfer`, body, config)
      setTransId(response.data.data.id)
      setIsError(false)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setMsg(error.response.data.msg)
      setIsLoading(false)
    }
  }

  const checkPinHandler = async () => {
    try {
      setIsLoading(true)
      setIsError(null)
      const { token } = data
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}/user/pin?pin=${pinCode}`, config)
      setMsg(response.data.msg)
      setPage('result')
      setShowEnterPin(false)
      setIsLoading(false)
      transfer()
      window.scrollTo(0, 0)
    } catch (error) {
      setIsError(true)
      setMsg("The pin is incorrect.")
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      const { token } = data
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}/export/transaction/${transId}`, config)
      setUrl(response.data.data.url)
      setMsg(response.data.msg)
      setShowDownload(true)
      setIsLoading(false)
    } catch (error) {
      setMsg(error.response.data.msg)
      setIsLoading(false)
    }
  }

  const validateBalance = () =>{
    if(amount > userData.balance){
      return setMsg('Your balance is not sulficient')
    }
    setMsg('')
    setPage('detail')
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    setIsNotesFilled(notes)
    setIsAmountFilled(amount)
    setMsg('')
  }, [notes, amount])

  useEffect(() => {
    setTitle("Transfer");
    getUserDetail()
  }, [])
  return (
    <>
      <UserLayout title={title}>
        <main className={styles.mainContainer}>
          {page === "process" ?
            <section className={styles.transferCard}>
              <div className={styles.title}>Transfer Money</div>
              <div className={styles.userCard}>
                <div className={styles.profPictContainer}><Image src={user.image ? `${process.env.NEXT_PUBLIC_CLOUDINARY}${user.image}` : Profpict} className={styles.profPict} width={'80px'} height={'80px'}/></div>
                <div className={styles.nameContainer}>
                  <div className={styles.name}>{user.firstName ? `${user.firstName} ${user.lastName}` :  <Placeholder className="w-75" />}</div>
                  <div className={styles.number}>{user.noTelp}</div>
                </div>
              </div>
              <div className={styles.transferInfo}>Type the amount you want to transfer and then press continue to the next steps.</div>
              <label htmlFor='transfer' className={styles.transferInputContainer}>
                <input type="number" name="transfer" id="transfer" placeholder='0'
                  onChange={e => {
                    setAmount(e.target.value)
                  }}
                />
              </label>
              <div className={styles.balanceInfo}>{`${currencyFormatter.format(userData.balance)} Available`}</div>
              <div className={styles.noteContainer}>
                <label htmlFor='notes' className={isNotesFilled ? styles.noteActive : styles.note}>
                  <Pencil className={isNotesFilled ? styles.iconActive : styles.icon} />
                  <input type="text" id='notes' placeholder='Add some notes'
                    onChange={e => setNotes(e.target.value)}
                  />
                </label>
              </div>
              <div className={styles.errorMsg}>{msg}</div>
              <div className={styles.buttonContainer}>
                {isAmountFilled && isNotesFilled ?
                  <div className={styles.continueButton}
                    onClick={validateBalance}
                  >Continue</div>
                  :
                  <div className={styles.continueButtonInactive}>Continue</div>
                }
              </div>
            </section>
            : page === 'detail' ?
              <section className={styles.transferCard}>
                <div className={styles.title}>Transfer Money</div>
                <div className={styles.userCard}>
                  <div className={styles.profPictContainer}><Image src={user.image ? `${process.env.NEXT_PUBLIC_CLOUDINARY}${user.image}` : Profpict} className={styles.profPict} width={'80px'} height={'80px'}/></div>
                  <div className={styles.nameContainer}>
                    <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
                    <div className={styles.number}>{user.noTelp}</div>
                  </div>
                </div>
                <div className={styles.title2}>Details</div>
                <div className={styles.cardDetail}>
                  <div className={styles.title}>Amount</div>
                  <div className={styles.info}>{currencyFormatter.format(amount)}</div>
                </div>
                <div className={styles.cardDetail}>
                  <div className={styles.title}>Balance Left</div>
                  <div className={styles.info}>{currencyFormatter.format(userData.balance - amount)}</div>
                </div>
                <div className={styles.cardDetail}>
                  <div className={styles.title}>Date {'&'} Time</div>
                  <div className={styles.info}>{date}</div>
                </div>
                <div className={styles.cardDetail}>
                  <div className={styles.title}>Notes</div>
                  <div className={styles.info}>{notes}</div>
                </div>
                <div className={styles.buttonContainer}>
                  <div className={styles.continueButton}
                    onClick={() => setShowEnterPin(true)}
                  >Continue</div>
                </div>
              </section>
              :
              <section className={styles.transferCard}>
                {isError ?
                  <div className={styles.responseContainer}>
                    <div className={`${styles.logoContainer} ${styles.error}`}><XLg className={styles.icon} /></div>
                    <div className={styles.title}>Transfer Failed</div>
                    <div className={styles.info}>We can't transfer your money at the moment, we recommend you to check your internet connection and try again.</div>
                  </div>
                  :
                  <div className={styles.responseContainer}>
                    <div className={`${styles.logoContainer} ${styles.success}`}><CheckLg className={styles.icon} /></div>
                    <div className={styles.title}>Transfer Success</div>
                  </div>
                }
                <div className={styles.cardDetail}>
                  <div className={styles.title}>Amount</div>
                  <div className={styles.info}>{currencyFormatter.format(amount)}</div>
                </div>
                <div className={styles.cardDetail}>
                  <div className={styles.title}>Balance Left</div>
                  <div className={styles.info}>{currencyFormatter.format(userData.balance - amount)}</div>
                </div>
                <div className={styles.cardDetail}>
                  <div className={styles.title}>Date {'&'} Time</div>
                  <div className={styles.info}>{date}</div>
                </div>
                <div className={styles.cardDetail}>
                  <div className={styles.title}>Notes</div>
                  <div className={styles.info}>{notes}</div>
                </div>
                <div className={styles.title2}>Transfer To</div>
                <div className={styles.userCard}>
                  <div className={styles.profPictContainer}><Image src={user.image ? `${process.env.NEXT_PUBLIC_CLOUDINARY}${user.image}` : Profpict} className={styles.profPict} width={'80px'} height={'80px'}/></div>
                  <div className={styles.nameContainer}>
                    <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
                    <div className={styles.number}>{user.noTelp}</div>
                  </div>
                </div>
                {isError ?
                  <div className={styles.buttonContainer}>
                    <div className={styles.continueButton}
                      onClick={transfer}
                    >Try Again</div>
                  </div>
                  :
                  <div className={styles.buttonContainer}>
                    <div className={styles.downloadButton}
                      onClick={handleDownload}
                    >
                      
                      {!isLoading ? <><Download />Download PDF</> : <Spinner animation="border" size="sm" />}
                    </div>
                    <div className={styles.continueButton}
                      onClick={() => router.push('/dashboard')}
                    >Back to Home</div>
                  </div>
                }
              </section>
          }
        </main>
        <Modal
          show={showDownload}
          onHide={() => setShowDownload(false)} className={styles.topUpModal}>
          <Modal.Header closeButton className={styles.modalHeader}>
          Download Transaction Details
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
          Are you sure to download this file?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" className={styles.modalPrimaryButton}
            onClick={() => setShowDownload(false)}
            >
              <Link href={url}>
                <a target="_blank">Download</a>
              </Link>
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showEnterPin}
          onHide={() => setShowEnterPin(false)} className={styles.topUpModal}>
          <Modal.Header closeButton className={styles.modalHeader}>
            Enter PIN to Transfer
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            Enter your 6 digits PIN for confirmation to continue transferring money.
            <div className={styles.pinContainer}>
              <ReactCodeInput type="number" fields={6} className={styles.reactCodeInput}
                onChange={handlePinChange}
              />
            </div>
            {isError ? <div className={styles.errorMsg}>{msg}</div> : <></>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" className={styles.modalPrimaryButton}
              onClick={checkPinHandler}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal>
      </UserLayout>
    </>
  )
}
