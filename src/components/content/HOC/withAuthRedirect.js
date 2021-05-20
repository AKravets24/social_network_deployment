import React from 'react';
import { connect } from "react-redux";

let mapStateToPropsForRedirect = (state) => ({ isAuth: state.appAuthReducer.isAuth });
export const withAuthRedirect = Component => {
    class RedirectComponent extends React.Component {
        render() { if (!this.props.isAuth) return null; else return <Component {...this.props} /> }
    }
    let ConnectedAuthRedirectComponent = connect(mapStateToPropsForRedirect)(RedirectComponent);
    return ConnectedAuthRedirectComponent;
};

