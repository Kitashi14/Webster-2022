import Container from "../Components/Shared/Container";
import Hero from "../Components/Hero";
import Page404 from "./Page404";

const LandingPage = () => {
  console.log("Landing page entered.");

  return (
    <>
      {/* Navbar Already set */}
      {/* hero should take full space */}
      <Hero />

      <Container>
        <div>djfls</div>
        <Page404 />
      </Container>
    </>
  );
};

export default LandingPage;
