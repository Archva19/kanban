import * as Yup from "yup";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required("emailRequired")
    .matches(emailRegex, "invalidEmail"),
});
