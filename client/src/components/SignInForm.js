import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory, Link } from "react-router-dom";
import img from "../welcome-logo.png";

function SignInForm() {
  const history = useHistory();
  const formSchema = yup.object().shape({
    email: yup
      .string()
      .required("Must enter email.")
      .email("Must enter valid email address."),
    password: yup.string().required("Must enter password."),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values, { resetForm }) => {
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .then(history.push("/"));
      resetForm({ values: "" });
    },
  });

  return (
    <>
      <h1>Please Sign In</h1>
      <img className="box" src={img} alt="logo"></img>
      <form onSubmit={formik.handleSubmit} className="box">
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.errors["email"] ? (
            <p className="error">{formik.errors["email"]}</p>
          ) : null}
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.errors["password"] ? (
            <p className="error">{formik.errors["password"]}</p>
          ) : null}
        </label>
        <br />
        <input type="submit" value="Sign In" className="input-btn" />
        <div className="button">
          <h2 className="noaccount">Don't have an account?</h2>
          <Link to="/signup">
            <button className="sign-up">Sign Up</button>
          </Link>
        </div>
      </form>
    </>
  );
}

export default SignInForm;
