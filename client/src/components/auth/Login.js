import React , {Fragment,useState } from 'react';
// import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData,updateForm] = useState({
    email:"",
    Password:"",
  });

  const {email,Password} = formData;

   const onChange = e => updateForm({...formData, [e.target.name]:e.target.value});
  const onSubmit = async e => {
    e.preventDefault();
    console.log("Success");
    }
  return <Fragment>
       <h1 className="large text-primary">Sign In</h1>
       <p className="lead"><i className="fas fa-user"></i> Sign In Your Account</p>
       <form className="form" onSubmit = {e => onSubmit(e)}>
         <div className="form-group">
           <input type="email" placeholder="Email Address" name="email"  value = {email} onChange = {e => onChange(e)} required/>
         </div>
         <div className="form-group">
           <input
             type="Password"
             placeholder="Password"
             name="Password"
             value = {Password}
            onChange = {e => onChange(e)}
             minLength="6"
             required
           />
         </div>
         <input type="submit" className="btn btn-primary" value="Register" />
       </form>
       <p className="my-1">
         Don't have an account? <Link to="/register">Sign Up</Link>
       </p>
  </Fragment>
}

export default Register;
