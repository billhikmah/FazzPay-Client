import { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from "axios";
import { useSelector } from 'react-redux';

import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons'
import Profpict from "../../assets/img/default-pict.png"
import Loading from '../../components/Loading';
import styles from "../../styles/History.module.css"
import UserLayout from '../../components/UserLayout'
import { currencyFormatter } from '../../helper/formatter';

export default function History() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [filter, setFilter] = useState('')
  const [pagination, setPagination] = useState([])


  const { data } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)

  const getHistory = async () => {
    try {
      setIsLoading(true)
      const { token } = data
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}/transaction/history?page=${page}&limit=${limit}&filter=${filter}`, config)
      setHistory(response.data.data)
      setPagination(response.data.pagination)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getHistory()
  }, [filter, limit, page])

  return (
    <>
      <UserLayout title={'Dashboard'}>
        <main className={styles.mainContainer}>
          <section className={styles.historyCard}>
            <div className={styles.titleContainer}>
              <div className={styles.title}>
                Transaction History
              </div>
              <div className="menuContainer">
                <select name="filter" id="filter"
                  className={styles.filter}
                  onChange={(e) => setFilter(e.target.value)}>
                  <option value=""  selected="true" disabled="disabled">-- Select Filter --</option>
                  <option value="WEEK">Week</option>
                  <option value="MONTH">Month</option>
                  <option value="YEAR">Year</option>
                </select>
              </div>
            </div>
            <div className={styles.historyContainer}>
              {history.length > 0 ? history.map(history => (
                <div className={styles.item}>
                  <div className={styles.pictNameContainer}>
                    <div className={styles.profPictContainer}><Image src={history.image ? `${process.env.NEXT_PUBLIC_CLOUDINARY}${history.image}` : Profpict} className={styles.profPict} width={'50px'} height={'50px'} /></div>
                    <div className={styles.nameContainer}>
                      <div className={styles.name}>{`${history.firstName} ${history.lastName}`}</div>
                      <div className={styles.status}>{history.type}</div>
                    </div>
                  </div>
                  <div className={`${styles.nominal} ${history.status === 'success' ? (history.type === 'send' ? styles.out : styles.in) : styles.pending}`}>{`${history.status === 'success' ? (history.type === 'send' ? '-' : '+') : ''}${currencyFormatter.format(history.amount)}`}</div>
                </div>
              )): <div class="text-center">
              <div class="spinner-border" role="status">
                <span class="sr-only"></span>
              </div>
            </div>}
            </div>
            <div className={history.length > 0 ? styles.pagination : styles.none}>
              {page === 1 ?
                <></>
                :
                <div className={`${styles.iconContainer}`}
                onClick={() => setPage(page - 1)}
                ><ArrowLeft className={styles.icon} /></div>
              }
              {`${pagination.page} / ${pagination.totalPage}`}
              {page === pagination.totalPage ?
                <></>
                :
                <div className={`${styles.iconContainer}`}
                  onClick={() => setPage(page + 1)}
                ><ArrowRight className={styles.icon} /></div>
              }
            </div>
          </section>
        </main>
      </UserLayout>
    </>
  )
}
