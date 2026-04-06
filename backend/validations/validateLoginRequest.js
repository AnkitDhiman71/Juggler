const yup=require('yup');
const userLoginSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password is required")
});
module.exports=userLoginSchema;