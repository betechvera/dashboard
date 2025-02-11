import { useRouter } from "next/router";
import styled, { createGlobalStyle } from "styled-components";
import Link from "next/link";
import styles from "@/styles/404.module.css";


const Custom404: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#e2e2e2] gap-20">
        <div className={styles.popup}>
          <div className="flex flex-col items-center relative w-full -mb-5 overflow-visible pointer-events-none">
            <div className="w-full bg[url('https://static5.smr.vc/3382db8e07ff887cae0784-header-image.webp')] aspect-501/284 bg-cover relative flex z-10 rounded-3xl" />
          </div>

          <div className="flex flex-col justify-center items-center text-center relative font-black z-20 drop-shadow-[0_0_10px_black] drop-shadow-[0_0_10px_black]">
            <div className="text-[8vw] text-white drop-shadow-[0_3px_0_#454545] mb-4 sm:text-3xl">404 - Página</div>
            <div className="text-[11vw] text-[#00ff66] drop-shadow-[0_3px_0_#004e03] relative z-10 sm:text-4xl">Não Encontrada</div>
          </div>
          <div className="flex items-center justify-center flex-col text-center text-white relative z-10 uppercase m-auto">
          {/* display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  color: white;
  position: relative;
  line-height: 2;
  z-index: 10;
  text-transform: uppercase;
  margin: 3% auto 5%; */}
            <h1 style={{textShadow: '0 3px 3px black'}} className="font-bold leading-none text-2xl sm:text-3xl">
              <span style={{ color: '#00FF66' }}>desculpe, mas</span>
            </h1>
            <h2 style={{textShadow: '0 3px 3px black'}} className="font-bold leading-none text-xl sm:text-2xl">esta página não existe</h2>
          </div>
          <footer className="flex items-center justify-center">
            <a className={styles.buttonPrimary} onClick={handleBack}>
              <span>Voltar</span>
            </a>
            <a className={styles.buttonSecundary} href="/">
              <span>Home</span>
            </a>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Custom404;