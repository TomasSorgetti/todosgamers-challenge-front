"use client";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import FormField from "@/components/ui/formField/FormField";
import CustomButton from "@/components/ui/button/Button";
import GoogleButton from "@/components/ui/googleButton/GoogleButton";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ui/progressBar/ProgressBar";
export default function LoginForm() {
  const router = useRouter();
  //* States
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    persist: false,
  });
  const [dataError, setDataError] = useState("");

  //* Handles
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };
  const handleCheck = () => {
    setData({ ...data, persist: !data.persist });
  };




  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (data.email && data.password) {
      setIsLoading(true);
      try {
        const responseNextAuth = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (responseNextAuth?.error) {
          setDataError(responseNextAuth.error);
          return;
        }
        router.push("/");
      } catch (error) {
        console.log("Error register form", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <ProgressBar loading={isLoading} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <h1>Iniciar Sesión</h1>
          <span>{dataError}</span>
        </div>
        <>
          <FormField
            type="email"
            label="Email:"
            name="email"
            placeholder="johndoe@gmail.com"
            value={data.email}
            handleChange={handleChange}
          />
          <FormField
            type="password"
            label="Contraseña:"
            name="password"
            placeholder="********"
            value={data.password}
            handleChange={handleChange}
          />
        </>
        <div className={styles.rememberMe}>
          <input type="checkbox" name="persist" id="persist" onChange={handleCheck} />
          <label htmlFor="persist">Recordarme</label>
        </div>
        <CustomButton stroked={true} variant="large" disabled={isLoading}>
          Iniciar Sesión
        </CustomButton>
        <div className={styles.forgotPassword}>
          ¿Olvidaste tu contraseña? <Link href="#">Cambiar contraseña</Link>
        </div>
        <div className={styles.divider}></div>
        <GoogleButton>Continuar con Google</GoogleButton>
        <div className={styles.register}>
          ¿Todavía no tienes una cuenta?{" "}
          <Link href="/register">Registrarse</Link>
        </div>
      </form>
    </>
  );
}
