import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Landing.module.css'
import { useSelector } from 'react-redux'
import { Telephone, Lock, Download, ArrowLeft, ArrowRight } from 'react-bootstrap-icons'

import Sponsor from '../assets/img/sponsor.png'
import Phone from '../assets/img/phone.png'
import Alex from '../assets/img/alex.png'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Landing() {
  const { isError } = useSelector(state => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (isError === false) {
      router.push('/dashboard')
    }
  }, [])
  return (
    <>
      <Head>
        <title>
          FazzPay
        </title>
      </Head>
      <div className={styles.banner}>
        <div className={styles.navbar}>
          <div className={styles.logo}>FazzPay</div>
          <div className={styles.authContainer}>
            <Link href={'/auth/login'}>
              <div className={styles.loginButton}>Login</div>
            </Link>
            <Link href={'/auth/signup'}>
              <div className={styles.signUpButton}>Sign Up</div>
            </Link>
          </div>
        </div>
        <div className={styles.banner2}>
          <div className={styles.title}>Awesome App <br /> For Saving Time.</div>
          <div className={styles.info}>We bring you a mobile app for banking problems that <br />oftenly wasting much of your times.</div>
          <div className={styles.button}>Try It Free</div>
        </div>
      </div>
      <section className={styles.section2}>
        <div className={styles.title}><span>Why</span> Choose FazzPay?</div>
        <div className={styles.info}>We have some great features from the application and it's totally free to use by all users around the world.</div>
        <div className={styles.infoContainer}>
          <div className={styles.side}>
            <div className={styles.imgContainer}><Telephone className={styles.icon} /></div>
            <div className={styles.itemTitle}>24/7 Support</div>
            <div className={styles.itemInfo}>We have 24/7 contact support so you can contact us whenever you want and we will respond it.</div>
          </div>
          <div className={styles.center}>
            <div className={styles.imgContainer}><Lock className={styles.icon} /></div>
            <div className={styles.itemTitle}>Data Privacy</div>
            <div className={styles.itemInfo}>We make sure your data is safe in our database and we will encrypt any data you submitted to us.</div>
          </div>
          <div className={styles.side}>
            <div className={styles.imgContainer}><Download className={styles.icon} /></div>
            <div className={styles.itemTitle}>Easy Download</div>
            <div className={styles.itemInfo}>Zwallet is 100% totally free to use it's now available on Google Play Store and App Store.</div>
          </div>
        </div>
      </section>
      <section className={styles.section3}>
        <Image src={Sponsor} />
      </section>
      <section className={styles.section4}>
        <div className={styles.money}>Rp. 390.736.500</div>
        <div className={styles.title}><span>Money</span> has Been Transfered.</div>
        <div className={styles.info}>That amount of money has been transfered from all users.<br /> We still counting and going strong!</div>
      </section>
      <section className={styles.section5}>
        <aside><Image src={Phone} /></aside>
        <main>
          <div className={styles.title}>All The <span>Great</span><br />FazzPay Features.</div>
          <div className={styles.itemContainer}>
            <div className={styles.number}><span>1.</span> Small Fee</div>
            <div className={styles.info}>We only charge 5% of every success transaction done in FazzPay app.</div>
          </div>
          <div className={styles.itemContainer}>
            <div className={styles.number}><span>2.</span> Data Secured</div>
            <div className={styles.info}>All your data is secured properly in our system and it's encrypted.</div>
          </div>
          <div className={styles.itemContainer}>
            <div className={styles.number}><span>3.</span> User Friendly</div>
            <div className={styles.info}>FazzPay come up with modern and sleek design and not complicated.</div>
          </div>
        </main>
      </section>
      <section className={styles.section6}>
        <div className={styles.title}>What Users are <span>Saying</span>.</div>
        <div className={styles.info}>We have some great features from the application and it's totally free <br /> to use by all users around the world.</div>
        <div className={styles.reviewContainer}>
          <div className={styles.arrow}><ArrowLeft /></div>
          <div className={styles.reviewBox}>
            <div className={styles.imgContainer}><Image src={Alex} className={styles.alex} /></div>
            <div className={styles.name}>Alex Hansinburg</div>
            <div className={styles.job}>Designer</div>
            <div className={styles.review}>“This is the most outstanding app that I've ever try in my live, this app is such an amazing masterpiece and it’s suitable for you who is bussy with their bussiness and must transfer money to another person aut there. Just try this app and see the power!”</div>
          </div>
          <div className={styles.arrow}><ArrowRight /></div>
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.title}>FazzPay</div>
        <div className={styles.info}>Simplify financial needs and saving much time in banking needs with one single app.</div>
        <div className={styles.bottom}>
          <div className={styles.copyright}>2022 FazzPay. All right reserved.</div>
          <div className={styles.right}>
            <div className={styles.phone}>+62 8224 2161 766</div>
            <div className={styles.email}>contact@fazzpay.com</div>
          </div>
        </div>
      </footer>
    </>
  )
}
