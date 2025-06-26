import "../App.css";
import BackgroundWrapper from '../components/commons/BackgroundWrapper'
import Footer from '../components/commons/Footer'
import Navbar from '../components/commons/navbar'
import CardSection1 from "../components/sections/cardssection1";


function CardPage1() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <BackgroundWrapper>
        <Navbar />
        <CardSection1/>
        <Footer />
      </BackgroundWrapper>
    </div>
  );
}

export default CardPage1;