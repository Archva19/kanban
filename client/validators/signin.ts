import * as Yup from "yup";

export const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "minimum 6 character")
    .max(20, "maximum 20 character"),
});
