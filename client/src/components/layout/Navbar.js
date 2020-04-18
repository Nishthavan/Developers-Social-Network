import React,{Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {logout} from "../../actions/auth";

 const Navbar = ({auth: {isAuth,loading},logout}) => {
   const authLink = (
     <ul>
       <li><Link  onClick ={logout} to='/'>
       <i className="fas fa-sign-out-alt"></i>{" "}
       <span className = "hide-sm">Logout</span></Link></li>
     </ul>
   );
   const guestLink = (
     <ul>
       <li><a href="#!">Developers</a></li>
       <li><Link to="/register">Register</Link></li>
       <li><Link to="/login">Login</Link></li>
     </ul>
   );
   return (
     <nav className="navbar bg-dark">
     <h1>
       <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
     </h1>
     {!loading && (<Fragment>{isAuth ? authLink : guestLink}</Fragment>)}
   </nav>
   );
 }

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProp = state => ({
  auth: state.auth
});
 export default connect(mapStateToProp,{logout})(Navbar);
