import { Link } from "react-router-dom";
import Container from "../Components/Shared/Container";

const HomePage = () => {
  console.log("Landing page entered.");

  return (
    <>
      <div>HomePage</div>
      <Container>
        <div>Complains</div>
        <div>gsdfhei</div>
      </Container>
      <Link to="/login">Login</Link>
    </>
  );
};

export default HomePage;
