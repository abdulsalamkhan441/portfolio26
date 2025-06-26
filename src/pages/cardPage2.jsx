import "../App.css";
import BackgroundWrapper from '../components/commons/BackgroundWrapper'
import Footer from '../components/commons/Footer'
import Navbar from '../components/commons/navbar'
import CardSection2 from "../components/sections/cardSection2";


function CardPage2() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <BackgroundWrapper>
        <Navbar />
        <CardSection2/>
        <Footer />
      </BackgroundWrapper>
    </div>
  );
}

export default CardPage2;