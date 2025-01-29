import { useRouter } from "next/router";
import styled, { createGlobalStyle } from "styled-components";
import Link from "next/link";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #e2e2e2;
  gap: 5rem;
  font-family: "Poppins";
`;

const Popup = styled.div`
  background: linear-gradient(210deg, #00332f 43.52%, #00ab7a 75.03%);
  height: auto;
  width: 95%;
  border-radius: 26px;
  box-shadow: 5px 5px 15px black;
  padding-bottom: 0.5%;

  @media screen and (min-width: 432px) {
    height: auto;
    width: 400px;
  }
`;

const ContainerHeaderImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  margin-bottom: -20%;
  overflow: visible;
  pointer-events: none;
`;

const HeaderImage = styled.div`
  width: 100%;
  background: url("https://static5.smr.vc/3382db8e07ff887cae0784-header-image.webp");
  aspect-ratio: 501 / 284;
  background-size: cover;
  position: relative;
  display: flex;
  z-index: 4;
  border-radius: 26px 26px 0 0;
`;

const ContainerTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  font-weight: 900;
  filter: drop-shadow(0 0 10px #000000e3) drop-shadow(0 0 10px #000000e3);
  -webkit-filter: drop-shadow(0 5px 10px #000000e3) drop-shadow(0 0 10px #000000e3);
  z-index: 10;
  font-family: "Poppins";
`;

const Title = styled.div`
  font-size: 11vw;
  color: #ffffff;
  -webkit-text-stroke-color: #ffffff;
  filter: drop-shadow(0 3px 0 #454545);
  position: relative;
  z-index: 5;
  letter-spacing: -1px;
  line-height: 1.3;

  @media screen and (min-width: 432px) {
    font-size: 42px;
  }
`;

const Subtitle = styled.div`
  font-size: 8.5vw;
  color: #00ff66;
  filter: drop-shadow(0 3px 0 #004e03);
  -webkit-text-stroke: 0.5px #299153;
  line-height: 1.3;
  margin-bottom: 2%;

  @media screen and (min-width: 432px) {
    font-size: 35px;
  }
`;

const ContainerDescPhrase = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  color: white;
  position: relative;
  line-height: 2;
  z-index: 10;
  text-transform: uppercase;
  margin: 3% auto 5%;
`;

const ButtonPrimary = styled.a`
  overflow: hidden;
  position: relative;
  color: black;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 4.5vw;
  text-shadow: 0 1px 10px white;
  width: 30%;
  text-align: center;
  padding: 8px 0;
  border-radius: 4px;
  background: linear-gradient(155deg, #ff9900, #f5cf52, #f5cf52, #ff9900);
  border-bottom: 2px solid #c0bc3f87;
  border-top: 2px solid #c0bc3fb1;
  animation: pulse-button 1s infinite;
  z-index: 9999999;
  margin-bottom: 2%;

  &::after {
    background: #fffb8e;
    will-change: left;
    content: "";
    height: 155px;
    left: -75px;
    position: absolute;
    top: -50px;
    transform: rotate(35deg);
    transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
    width: 25px;
    z-index: -10;
    animation: shade 2s infinite ease-in-out;
  }

  @media screen and (min-width: 432px) {
    font-size: 18px;
  }
`;

const ButtonSecondary = styled(Link)`
  overflow: hidden;
  position: relative;
  color: rgb(0, 0, 0);
  text-transform: uppercase;
  font-weight: 600;
  text-decoration: underline black;
  font-size: 4.5vw;
  width: 30%;
  text-align: center;
  padding: 8px 0;
  border-radius: 4px;
  z-index: 9999999;
  margin-bottom: 2%;

  &:hover {
    color: white;
    text-decoration: underline white;
  }

  @media screen and (min-width: 432px) {
    font-size: 18px;
  }
`;

const GlobalStyle = createGlobalStyle`
  @keyframes shade {
    30% {
      left: 120%;
    }
  }

  @keyframes pulse-button {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 5px 0 #89d897;
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 5px 10px rgba(43, 250, 1, 0);
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 5px 0 rgba(43, 250, 1, 0);
    }
  }
`;

const Custom404: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <GlobalStyle />
      <Container className="bg-gray-200">
        <Popup>
          <ContainerHeaderImage>
            <HeaderImage />
          </ContainerHeaderImage>
          <ContainerTitle>
            <Title>404 - Página</Title>
            <Subtitle>Não Encontrada</Subtitle>
          </ContainerTitle>
          <ContainerDescPhrase>
            <h1 style={{textShadow: '0 3px 3px black'}} className="font-bold leading-none text-2xl sm:text-3xl">
              <span style={{ color: '#00FF66' }}>desculpe, mas</span>
            </h1>
            <h2 style={{textShadow: '0 3px 3px black'}} className="font-bold leading-none text-xl sm:text-2xl">esta página não existe</h2>
          </ContainerDescPhrase>
          <footer className="flex items-center justify-center">
            <ButtonPrimary onClick={handleBack}>
              <span>Voltar</span>
            </ButtonPrimary>
            <ButtonSecondary href="/">
              <span>Home</span>
            </ButtonSecondary>
          </footer>
        </Popup>
      </Container>
    </>
  );
};

export default Custom404;