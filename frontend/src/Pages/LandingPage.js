import { Link } from "react-router-dom";
import Container from "../Components/Shared/Container";

const LandingPage = () => {
  console.log("Landing page entered.");

  return (
    <>
      <div>sldfjsld</div>
      <Container>
        <div>djfls</div>
        <div>gsdfhei</div>
      </Container>
      <Link to="/login">Login Page</Link>
    </>
  );
};

export default LandingPage;
