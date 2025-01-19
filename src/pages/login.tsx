import styles from "./login.module.css";

const Login: React.FC = () => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
    };

    return (
        <div className={styles.containerAll}>
            <div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.containerTitle}>
                        <h1 className={styles.title}>Faça o seu login</h1>
                        <div className={styles.bar}></div>
                    </div>
                    <div className={styles.campoInput}>
                        <label className="text-red-500" htmlFor="email">Seu e-mail*</label>
                        <input className={styles.inputField} type="email" id="email" />
                    </div>
                    <div className={styles.campoInput}>
                        <label htmlFor="password">Sua senha*</label>
                        <input className={styles.inputField} type="password" id="password" />
                    </div>
                    <div className={styles.remember}>
                        <input type="checkbox" />
                        <p>Lembrar-me</p>
                    </div>
                    <div className={styles.button}>
                        <a href="#">Entrar</a>
                    </div>
                    <p className={styles.paragraf}>
                        Esqueceu sua senha?
                        <a className={styles.link} href="/recovery"> Clique aqui!</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;