import React , {Fragment,useState } from 'react';
// import axios from "axios";
import { Link,Redirect} from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import PropTypes from "prop-types";
import {register} from "../../actions/auth";



const Register = ({setAlert,register,isAuth}) => {
  const [formData,updateForm] = useState({
    name:"",
    email:"",
    Password:"",
    Password2:"",
  });

  const {name,email,Password,Password2} = formData;

   const onChange = e => updateForm({...formData, [e.target.name]:e.target.value});
  const onSubmit = async e => {
    e.preventDefault();
    if(Password!==Password2){
      setAlert("Password are not matching","danger");
    }
    else{
      register({name,email,Password});
      // const newUser = {
      //   name,
      //   email,
      //   Password
      // }
      // try {
      //    const config = {
      //      headers : {
      //        "Content-Type" : "application/json"
      //      }
      //    }
      //    const body  = JSON.stringify(newUser);
      //
      //    const res = await axios.post("/api/users",body,config);
      //    console.log(res.data);
      //
      // } catch (err) {
      //   console.error(err.response.data);
      // };
    }
  }

  if(isAuth){
    return <Redirect to="/dashboard" />
  }
  return <Fragment>
       <h1 className="large text-primary">Sign Up</h1>
       <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
       <form className="form" onSubmit = {e => onSubmit(e)}>
         <div className="form-group">
           <input type="text" placeholder="Name" name="name" value = {name} onChange = {e => onChange(e)}  />
         </div>
         <div className="form-group">
           <input type="email" placeholder="Email Address" name="email"  value = {email} onChange = {e => onChange(e)} />
           <small className="form-text"
             >This site uses Gravatar so if you want a profile image, use a
             Gravatar email</small
           >
         </div>
         <div className="form-group">
           <input
             type="Password"
             placeholder="Password"
             name="Password"
             value = {Password}
            onChange = {e => onChange(e)}

           />
         </div>
         <div className="form-group">
           <input
             type="Password"
             placeholder="Confirm Password"
             name="Password2"
            value = {Password2}
            onChange = {e => onChange(e)}

           />
         </div>
         <input type="submit" className="btn btn-primary" value="Register" />
       </form>
       <p className="my-1">
         Already have an account? <Link to="/login">Sign In</Link>
       </p>
  </Fragment>
}


Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuth: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth
});

export default connect(mapStateToProps,{ setAlert,register })(Register);
