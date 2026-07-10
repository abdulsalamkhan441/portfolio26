import "../App.css";
import BackgroundWrapper from '../components/commons/BackgroundWrapper'
import Footer from '../components/commons/Footer'
import Navbar from '../components/commons/navbar'
import CardSection3 from "../components/sections/cardSection3";


function CardPage3() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <BackgroundWrapper>
        <Navbar />
        <CardSection3/>
        <Footer />
      </BackgroundWrapper>
    </div>
  );
}

export default CardPage3;