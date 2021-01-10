import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {updateObject, checkValidation} from '../../shared/utility';

import Input from  '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import LoginPage from '../Login/LoginPage';

import * as actions from '../../store/actions/index';



class Auth extends Component{
    state={
        controls:{
            email:{
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Email Adresiniz',
                },
                value:'',
                validation:{
                    required:true,                  
                    isEmail:true
                },
                valid:false,
                touched:false
            },
            password:{
                elementType:'input',
                elementConfig:{
                    type:'password',
                    placeholder:'Parola',
                },
                value:'',
                validation:{
                    required:true,                  
                    minLength:6
                },
                valid:false,
                touched:false
            }
        },
        isSignUp:true
    }
    componentDidMount(){
        if (!this.props.buildingUrunler && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath();
        }
    }



    inputChangedHandler= (event,controlName)=>{
        const updatedControls = updateObject(this.state.controls,{
            [controlName]: updateObject (this.state.controls[controlName],{
                value:event.target.value,
                valid:checkValidation(event.target.value, this.state.controls[controlName].validation),
                touched:true
            })
        });
        this.setState({controls:updatedControls});
    }

    submitHandler= (event) =>{
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    }

    switchAuthModeHandler=()=>{
        this.setState(prevState=>{
           return {isSignUp: !prevState.isSignUp};
        })

    }

    render(){
        const formElementArray=[];
        for (let key in this.state.controls){
            formElementArray.push({
                id:key,
                config:this.state.controls[key]
            });
        }

        let form = formElementArray.map(formElement=>(
            <Input key={formElement.id}
                elementType={formElement.config.elementType} 
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event)=>{this.inputChangedHandler(event,formElement.id)}}/>
        ));

        if(this.props.loading){
            form= <Spinner/>
        }
        let errorMessage = null;
        if(this.props.error){
            errorMessage= (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if(this.props.isAuthenticated){
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        }


        return(
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit = {this.submitHandler} >
                {form}
                <Button btnType='Success'>Onayla</Button>
                </form>
                <Button
                clicked={this.switchAuthModeHandler}
                btnType='Danger'>{this.state.isSignUp? 'Üye Girişi için Tıklayınız' : 'Yeni Üye Olmak için Tıklayınız'}</Button>
                <LoginPage/>
            </div>
        );
    }
}

const mapStateToProps= state =>{
    return{
        loading:state.auth.loading,
        error:state.auth.error,
        isAuthenticated: state.auth.token!==null,
        buildingUrunler: state.urunler.building,
        authRedirectPath: state.auth.authRedirectPath
        
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        onAuth:(email,password, isSignUp)=>dispatch(actions.auth(email,password,isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirect('/'))
    };
};

export default connect(mapStateToProps,mapDispatchToProps) (Auth);