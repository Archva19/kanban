import * as Yup from "yup";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required("fullNameRequired"),
  email: Yup.string()
    .required("emailRequired")
    .matches(emailRegex, "invalidEmail"),
  password: Yup.string()
    .required("passwordRequired")
    .min(6, "min6char")
    .max(20, "max20char"),
});
