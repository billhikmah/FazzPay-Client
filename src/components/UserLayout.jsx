import { useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { Bell, Grid, ArrowUp, PlusLg, Person, Upload } from "react-bootstrap-icons"
import { Modal, Button, Spinner, Placeholder} from "react-bootstrap"
import { useRouter } from 'next/router'
import Head from "next/head"
import Image from 'next/image'
import Link from 'next/link'
import Loading from '../components/Loading';
import styles from "../styles/UserLayouts.module.css"
import ProfilePlaceHolder from "../assets/img/profile-placeholder.jpg"
import axios from "axios";
import { logoutAction } from "../redux/actionCreators/auth";

export default function UserLayout({ children, title, name, number }) {
  const [showTopUp, setShowTopUp] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [amount, setAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [msg, setMsg] = useState("")
  const [link, setLink] = useState("")

  const router = useRouter()
  const dispatch = useDispatch()
  const { data } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)

  const submitTopUpHandler = async () => {
    try {
      setIsLoading(true)
      const { token } = data
      const body = { amount }
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}/transaction/top-up`, body, config)
      setMsg(response.data.msg)
      setLink(response.data.data.redirectUrl)
      setIsSuccess(true)
      console.log(response.data)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsSuccess(false)
      setIsLoading(false)
    }
  }

  const logoutHandler = async () => {
    try {
      setIsLoading(true)
      const { token } = data
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}/auth/logout`, config)
      console.log(response)
      dispatch(logoutAction())
      setIsLoading(false)
      setShowLogout(false)
      router.push('/')
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  return (
    <>
      <Head>
        <title>
          {title}
        </title>
      </Head>
      <header className={styles.header}>
        <div className={styles.logo}><Link href={"/"}>FazzPay</Link></div>
        <div className={styles.profileContainer}>
          <div className={styles.profPictContainer}><Image src={userData.image ? `${process.env.NEXT_PUBLIC_CLOUDINARY}${userData.image}` : ProfilePlaceHolder} className={styles.profPict} width={"50px"} height={"50px"}/></div>
          <div className={styles.nameContainer}>
            <div className={styles.userName}>{ userData.firstName ? `${userData.firstName} ${userData.lastName}` : <Placeholder xs={8} /> }</div>
            <div className={styles.userNumber}>{userData.noTelp ? userData.noTelp : <Placeholder xs={8} />}</div>
          </div>
          <div className={styles.notif}><Bell className={styles.icon} /></div>
        </div>
      </header>
      <main className={styles.mainContainer}>
        <nav className={styles.nav}>
          <div className={styles.mainNav}>
            <Link href={"/dashboard"}>
              <div className={title === "Dashboard" && !showTopUp ? styles.menuActive : styles.menu}><Grid className={styles.icon} /> Dashboard</div>
            </Link>
            <Link href={"/transfer"}>
              <div className={title === "Transfer" && !showTopUp ? styles.menuActive : styles.menu}><ArrowUp className={styles.icon} /> Transfer</div>
            </Link>
            <div className={showTopUp ? styles.menuActive : styles.menu}
              onClick={() => {
                setShowTopUp(true)
                setIsSuccess(false)
              }}
            ><PlusLg className={styles.icon} /> Top Up</div>
            <Link href={"/profile"}>
              <div className={title === "Profile" && !showTopUp ? styles.menuActive : styles.menu}><Person className={styles.icon} /> Profile</div>
            </Link>
          </div>
          <div className={styles.logout}
            onClick={() => setShowLogout(true)}
          ><Upload className={styles.icon} /> Logout</div>
        </nav>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className={styles.copyright}>2022 FazzPay. All right reserved.</div>
        <div className={styles.right}>
          <div className={styles.phone}>+62 5637 8882 9901</div>
          <div className={styles.email}>contact@fazzpay.com</div>
        </div>
      </footer>
      
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
      
      <Modal
        show={showTopUp}
        onHide={() => setShowTopUp(false)} className={styles.topUpModal}>
        <Modal.Header closeButton className={styles.modalHeader}>
          Top Up
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {isSuccess ?
            <>
              Do you want to proceed the payment?
            </>
            : <>
              Enter the amount of money, and click submit
              <label htmlFor="amount" className={styles.inputTopUpContainer}>
                <input type="number" id="amount" className={styles.inputTopUp}
                  onChange={e => setAmount(e.target.value)}/>
              </label>
            </>
          }
        </Modal.Body>
        <Modal.Footer>
          {isSuccess ?
            <>
              <Button variant="secondary" onClick={() => setShowTopUp(false)}>
                Back
              </Button>
              <Button variant="primary" className={styles.modalPrimaryButton} onClick={() => setShowTopUp(false)}>
                <Link href={link}>
                  <a target="_blank">Complete The Payment</a>
                </Link>
              </Button>
            </>
            :
            <Button variant="primary" onClick={submitTopUpHandler} className={styles.modalPrimaryButton}>
              Top Up
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}
