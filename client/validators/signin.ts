import * as Yup from "yup";

export const SignInSchema = Yup.object().shape({
  email: Yup.string().email("invalidEmail").required("emailRequired"),
  password: Yup.string()
    .required("passwordRequired")
});
