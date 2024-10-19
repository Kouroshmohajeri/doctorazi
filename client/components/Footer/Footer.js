import React from 'react'
import styles from './Footer.module.css';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <div className={styles.GeneralDetails}>
                        <h2>My Doctor</h2>
                        <p>
                         Your trusted healthcare booking platform since 2024
                        </p>
                    </div>
                </div>
                <div className='col'>
                    <div className={styles.ImportantLinks}>
                        <Link href="/" className={styles.Links}>FAQ</Link>
                        <Link href="/" className={styles.Links}>Contact us</Link>
                        <Link href="/" className={styles.Links}>Terms of Service</Link>
                    </div>
                </div>
            </div>
            <hr/>
            <div className='row'>
                <div className='col'>
                    <div className={styles.designer}>
                        <h6>Designed by Kourosh Mohajeri</h6>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
