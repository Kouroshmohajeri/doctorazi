import Alert from "@/components/Alert/Alert";
import RecentBlogs from "@/components/RecentBlogs/RecentBlogs";
import Specialities from "@/components/Specialities/Specialities";
import Steps from "@/components/Steps/Steps";
import TimeLine from "@/components/TimeLine/TimeLine";
import styles from "./page.module.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";


export default async function Home() {

  return (
    <main className={styles.body}>
      <Header/>
      <TimeLine source={"/images/timeline.jpg"} headLine={'TimeLine:Slang'}/>
      <Steps/>
      <Specialities/>
      <RecentBlogs/>
      <Alert/>
      <Footer/>
    </main>
  );
}
