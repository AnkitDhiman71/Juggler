const yup=require('yup');
const userSignupSchema = yup.object({
  username: yup.string().min(2).max(50).required("Username is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password is required")
});
module.exports=userSignupSchema;