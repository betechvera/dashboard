import { useRouter } from "next/router";
import styles from "./404.module.css";
import Link from "next/link";
// import Image from "next/image";

const Custom404: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.popup}>
        <div className={styles.containerHeaderImage}>
          <div className={styles.headerImage}></div>
        </div>
        <div className={styles.containerTitle}>
          <div className={styles.title}>404 - Página</div>
          <div className={styles.subtitle}>Não Encontrada</div>
        </div>
        <div className={styles.containerDescPhrase}>
          <h1>
            <span>desculpe, mas</span>
          </h1>
          <h2>esta página não existe</h2>
        </div>
        <div className={styles.footer}>
          <a className={styles.buttonPrimary} onClick={handleBack}>
            <span>Voltar</span>
          </a>
          <Link href="/">
            <a className={styles.buttonSecundary}>
              <span>Home</span>
            </a>
          </Link>
        </div>
      </div>
      {/* <div className={styles.tigre}>
            <Image
                src="/assets/image copy.png"
                alt="Imagem do Tigrinho"
                width={500}
                height={300}
            />
        </div> */}
    </div>
  );
};

export default Custom404;
