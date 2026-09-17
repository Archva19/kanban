import * as Yup from "yup";

export const resetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .required("requiredFields")
    .min(6, "min6char")
    .max(20, "max20char"),
  confirmPassword: Yup.string()
    .required("requiredFields")
    .oneOf([Yup.ref("newPassword")], "passwordsMustMatch"),
});
