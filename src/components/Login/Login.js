import "../Login/Login.scss";

import * as Yup from "yup";

import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

import { API_URL } from "../../constants/routes.js";
import { auth } from "../../config/firebase";
import axios from "axios";
import { connect } from "react-redux";
import logo from "../../img/logo.png";
import { setMyUser } from "../../actions/chat.actions";

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Слишком короткое!")
    .max(15, "Слишком длинное!")
    .required("Заполните поле"),
  lastName: Yup.string()
    .min(2, "Слишком короткое!")
    .max(15, "Слишком длинное!")
    .required("Заполните поле"),
  userName: Yup.string()
    .min(2, "Слишком короткое!")
    .max(15, "Слишком длинное!")
    .required("Заполните поле"),
  password: Yup.string().required("Заполните поле"),
  email: Yup.string()
    .email("Неверный формат поля")
    .required("Заполните поле")
});

const SigninSchema = Yup.object().shape({
  password: Yup.string().required("Заполните поле"),
  email: Yup.string()
    .email("Неверный формат поля")
    .required("Заполните поле")
});

function Login({ setMyUser }) {
  const [tab, setTab] = useState("Sign In");

  const handleLogin = values => {
    auth
      // .signInWithEmailAndPassword("b@b.com", "xxxxxx")
      // .signInWithEmailAndPassword(
      //   localStorage.getItem("type") === "b" ? "b@b.com" : "a@a.com",
      //   "xxxxxx"
      // )
      .signInWithEmailAndPassword(values.email, values.password)
      .then(response => {
        const { user } = response;
        console.log(response);

        setMyUser({
          id: user.uid,
          email: user.email
        });
        localStorage.setItem("auth_token", user.ma);
      })
      .catch(error => {
        if (
          error.message ===
          "Too many unsuccessful login attempts. Please try again later."
        ) {
          alert(
            "Слишком много неудачных попыток входа в систему. Пожалуйста, попробуйте позже."
          );
        } else if (
          error.message ===
          "The password is invalid or the user does not have a password."
        ) {
          alert("Пароль неверен! Попробуйте снова!");
        } else if (
          error.message ===
          "There is no user record corresponding to this identifier. The user may have been deleted."
        ) {
          alert(
            "Нет записи пользователя по данному email. Возможно, пользователь был удален или email задан неверно!"
          );
        }
      });
  };

  const handleRegistration = values => {
    auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(async response => {
        const { user } = response;
        console.log(response);

        await axios.patch(`${API_URL}/users.json`, {
          [user.uid]: {
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.userName,
            email: values.email,
            avatar: "",
            isOnline: false
          }
        });
        setMyUser({
          id: user.uid,
          email: user.email
        });
        localStorage.setItem("auth_token", user.ma);
      })
      .catch(error => {
        if (
          error.message ===
          "The email address is already in use by another account."
        ) {
          alert(
            "Адрес электронной почты уже используется другой учетной записью."
          );
        }
        console.log(error.message);
      });
  };

  // useEffect(() => {
  //   handleLogin();
  // }, []);

  return (
    <div className="Login">
      <div className="login-body">
        <h1 className="title-logo">
          <img src={logo}></img>
        </h1>
        <div className="tabs">
          <button
            className={tab === "Sign In" ? "active" : ""}
            onClick={() => setTab("Sign In")}
          >
            Вход
          </button>
          <i className="login-pipe" />
          <button
            className={tab === "Sign Up" ? "active" : ""}
            onClick={() => setTab("Sign Up")}
          >
            Зарегистрироваться
          </button>
        </div>
        {tab === "Sign In" && (
          <div className="login-wrapper">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={SigninSchema}
              onSubmit={values => {
                handleLogin(values);
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field name="email" placeholder="Email" className="input" />
                  {errors.email && touched.email ? (
                    <div>{errors.email}</div>
                  ) : null}
                  <Field
                    name="password"
                    placeholder="Пароль"
                    className="email"
                  />
                  {errors.password && touched.password ? (
                    <div>{errors.password}</div>
                  ) : null}
                  <button className="btn-submit" type="submit">
                    Войти
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {tab === "Sign Up" && (
          <div className="login-wrapper">
            <Formik
              initialValues={{
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                userName: ""
              }}
              validationSchema={SignupSchema}
              onSubmit={values => {
                handleRegistration(values);
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field name="firstName" placeholder="Имя" className="input" />
                  {errors.firstName && touched.firstName ? (
                    <div>{errors.firstName}</div>
                  ) : null}
                  <Field
                    name="lastName"
                    placeholder="Фамилия"
                    className="input"
                  />
                  {errors.lastName && touched.lastName ? (
                    <div>{errors.lastName}</div>
                  ) : null}
                  <Field
                    name="userName"
                    placeholder="Username"
                    className="input"
                  />
                  {errors.userName && touched.userName ? (
                    <div>{errors.userName}</div>
                  ) : null}
                  <Field name="email" placeholder="Email" className="input" />
                  {errors.email && touched.email ? (
                    <div>{errors.email}</div>
                  ) : null}
                  <Field
                    name="password"
                    placeholder="Пароль"
                    className="email"
                  />
                  <div>
                    <p>Пароль не меньше 6 символов</p>
                  </div>
                  {errors.password && touched.password ? (
                    <div>{errors.password}</div>
                  ) : null}
                  <button className="btn-submit" type="submit">
                    Зарегистрироваться
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  myUser: state.myUser
});

const mapDispatchToProps = {
  setMyUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
