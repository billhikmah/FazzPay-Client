import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Modal, Button, Placeholder, Spinner } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux";

import Loading from '../../components/Loading';
import styles from "../../styles/Dashboard.module.css"
import UserLayout from '../../components/UserLayout'
import { ArrowUp, PlusLg, ArrowDown } from 'react-bootstrap-icons'
import Profpict from "../../assets/img/default-pict.png"
import { getUserDataAction } from '../../redux/actionCreators/userData';
import { currencyFormatter } from '../../helper/formatter';

export default function Dashboard() {
  console.log(process.env.NEXT_PUBLIC_BE_HOST)
  console.log(process.env.NEXT_PUBLIC_CLOUDINARY)
  const [title, setTitle] = useState("")
  const [showTopUp, setShowTopUp] = useState(false)
  const [amount, setAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [msg, setMsg] = useState("")
  const [link, setLink] = useState("")
  const [history, setHistory] = useState([])
  const [dashboard, setDashboard] = useState({})
  const [listIncome, setListIncome] = useState([])
  const [listExpense, setListExpense] = useState([])

  const router = useRouter()
  const dispatch = useDispatch()
  const { data } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)

  const getHistory = async () => {
    try {
      setIsLoading(true)
      const { token } = data
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}/transaction/history?page=1&limit=4`, config)
      console.log(`${process.env.NEXT_PUBLIC_BE_HOST}`)
      console.log(response)
      setHistory(response.data.data)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const getDashboard = async () => {
    try {
      setIsLoading(true)
      const { token } = data
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}/dashboard/${data.id}`, config)
      console.log(response)
      setDashboard(response.data.data)
      setListExpense(response.data.data.listExpense)
      setListIncome(response.data.data.listIncome)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setTitle("Dashboard")
    dispatch(getUserDataAction(data.id, data.token))
    getHistory()
    getDashboard()
  }, [isSuccess])

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
  return (
    <>
      <UserLayout title={title}>
        <main className={styles.mainContainer}>
          <section className={styles.balanceContainer}>
            <div className={styles.balanceLeft}>
              <div className={styles.title}>Balance</div>
              <div className={styles.balance}>{userData.balance ? currencyFormatter.format(userData.balance) :<Placeholder style={{ width: '200%' }} />}</div>
              <div className={styles.phone}>{userData.noTelp}</div>
            </div>
            <div className={styles.balanceRight}>
              <div className={styles.transfer}
                onClick={() => router.push('/transfer')}
              ><ArrowUp className={styles.icon} /> Transfer</div>
              <div className={styles.transfer}
                onClick={() => {
                  setShowTopUp(true)
                  setIsSuccess(false)
                }}
              ><PlusLg className={styles.icon} /> Top Up</div>
            </div>
          </section>
          <section className={styles.bottomContainer}>
            <section className={styles.chartContainer}>
              <div className={styles.chartTop}>
                <div className={styles.income}>
                  <ArrowDown className={styles.icon} />
                  <div className={styles.title}>Income</div>
                  <div className={styles.total}>{dashboard.totalIncome ? currencyFormatter.format(dashboard.totalIncome) : <Placeholder style={{ width: '100%' }} /> }</div>
                </div>
                <div className={styles.expense}>
                  <ArrowUp className={styles.icon} />
                  <div className={styles.title}>Expense</div>
                  <div className={styles.total}>{dashboard.totalIncome ? currencyFormatter.format(dashboard.totalExpense) : <Placeholder style={{ width: '100%' }} />}</div></div>
              </div>
              <div className={styles.chartBottom}>
                {listIncome.map(item => (
                  <div className={styles.dayContainer}>
                    <div className={styles.bar} style={{ height: `${item.total * 100 / 500000}%` }}></div>
                    <div className={styles.day}>{item.day.substring(0, 3)}</div>
                  </div>
                ))}
              </div>
              <div className={styles.chartBottom}>
                {listExpense.map(item => (
                <div className={styles.expenseContainer}>
                  <div className={styles.barExpense} style={{ height: `${item.total * 100 / 500000}%` }}></div>
                </div>
                ))}
              </div>
            </section>
            <section className={styles.historyContainer}>
              <div className={styles.titleContainer}>
                <div className={styles.title}>Transaction History</div>
                <div className={styles.seeAll}
                  onClick={() => router.push('/history')}
                >See all</div>
              </div>
              <div className={styles.transactionContainer}>
                {history.length > 0 ? history.map(history => (
                  <div className={styles.item}>
                    <div className={styles.pictNameContainer}>
                      <div className={styles.profPictContainer}><Image src={history.image ? `${process.env.NEXT_PUBLIC_CLOUDINARY}${history.image}` : Profpict} className={styles.profPict} width={'50px'} height={'50px'} /></div>
                      <div className={styles.nameContainer}>
                        <div className={styles.name}>{history.firstName}</div>
                        <div className={styles.status}>{history.type}</div>
                      </div>
                    </div>
                    <div className={`${styles.nominal} ${history.status === 'success' ? (history.type === 'send' ? styles.out : styles.in) : styles.pending}`}>{`${history.status === 'success' ? (history.type === 'send' ? '-' : '+') : ''}${currencyFormatter.format(history.amount)}`}</div>
                  </div>

                )) : <div class="text-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only"></span>
                </div>
              </div> }
                {/* <div className={styles.item}>
                  <div className={styles.pictNameContainer}>
                    <div className={styles.profPictContainer}><Image src={Profpict} className={styles.profPict} /></div>
                    <div className={styles.nameContainer}>
                      <div className={styles.name}>Samuel Suhi</div>
                      <div className={styles.status}>Accept</div>
                    </div>
                  </div>
                  <div className={`${styles.nominal} ${styles.in}`}>+Rp50.000</div>
                </div> */}
              </div>
            </section>
          </section>
        </main>
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
      </UserLayout>
    </>
  )
}
