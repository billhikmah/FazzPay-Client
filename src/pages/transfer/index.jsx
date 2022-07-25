import React from 'react'
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from 'next/router'
import { Spinner } from "react-bootstrap"

import Loading from '../../components/Loading';
import styles from "../../styles/Transfer.module.css"
import UserLayout from '../../components/UserLayout'
import { Search, ArrowLeft, ArrowRight } from 'react-bootstrap-icons'
import Profpict from "../../assets/img/profile-placeholder.jpg"

export default function Transfer() {
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("")
  const [order, setOrder] = useState("ASC")
  const [pagination, setPagination] = useState([])

  const { data } = useSelector(state => state.auth)
  const router = useRouter()

  const getUser = async () => {
    try {
      setIsLoading(true)
      const { token } = data
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const url = `${process.env.NEXT_PUBLIC_BE_HOST}/user?page=${page}&limit=${limit}`
      if (search !== "") {
        url += `&search=${search}`
      }
      if(sort !== ""){
        url += `&sort=${sort} ${order}`
      }
      const response = await axios.get(url, config)
      setUser(response.data.data)
      setPagination(response.data.pagination)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setTitle("Transfer");
    getUser()
  }, [page])

  useEffect(() => {
    setTitle("Transfer");
    setPage(1)
    getUser()
  }, [search, sort, limit, order])

  return (
    <>
      <UserLayout title={title}>
        <main className={styles.mainContainer}>
          <section className={styles.transferCard}>
            <div className={styles.titleContainer}>
              <div className={styles.title}>Search Receiver</div>
              <div className="menuContainer">
                <select name="sort" id="sort"
                className={styles.filter}
                  onChange={(e) => setSort(e.target.value)}>
                  <option value="">All</option>
                  <option value="noTelp">Phone</option>
                  <option value="firstName">Name</option>
                </select>
                <select name="order" id="order"
                className={styles.filter}
                  onChange={(e) => setOrder(e.target.value)}>
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </div>
            </div>
            <label className={styles.searchContainer}>
              <div className={styles.iconContainer}><Search className={styles.icon} /></div>
              <input type="text" placeholder='Search receiver here'
                onChange={e => {
                  setTimeout(() => { setSearch(e.target.value) }, 2000)
                }}
              />
            </label>
            <div className={styles.receiverContainer}>
              {user.length > 0 ? user.map(user => (
                <div className={styles.userCard} key={user.id}
                  onClick={() => router.push(`/transfer/${user.id}`)}
                >
                  <div className={styles.profPictContainer}>
                    <Image
                      src={user.image === null ? Profpict : `${process.env.NEXT_PUBLIC_CLOUDINARY}${user.image}`}
                      className={styles.profPict} width={'80px'} height={'80px'} /></div>
                  <div className={styles.nameContainer}>
                    <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
                    <div className={styles.number}>{user.noTelp}</div>
                  </div>
                </div>
              )) : <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="sr-only"/>
              </div>
            </div>}
            </div>
            <div className={user.length > 0 ? styles.pagination : styles.none}>
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
