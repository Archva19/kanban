import * as Yup from "yup";

export const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required("fullNameRequired"),
  email: Yup.string().email("invalidEmail").required("emailRequired"),
  password: Yup.string()
    .required("passwordRequired")
    .min(6, "min6char")
    .max(20, "max20char"),
});
