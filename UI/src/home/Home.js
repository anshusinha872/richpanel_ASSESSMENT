import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import { useNavigate } from "react-router-dom";
export const Home = () => {
  const navigate = useNavigate();
  const isLoggedin = useSelector((state) => state.user.login);
  const pageList = useSelector((state) => state.user.pages);
  const dispatch = useDispatch();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };
  const getToken = () => {
    return localStorage.getItem("token");
  };
  const responseFacebook = async (fbresponse) => {
    const response = await axios.post(
      `https://us-central1-socialpanel-1ecb9.cloudfunctions.net/app/api/v1/accounts/authenticate`,
      fbresponse,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    dispatch({ type: "AUTHENTICATE", response: response.data.data });
  };
  const isAlreadyAuthenticated = async () => {
    const response = await axios.get(
      "https://us-central1-socialpanel-1ecb9.cloudfunctions.net/app/api/v1/accounts/authenticate",
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    if (response.data.statusCode == 200) {
      dispatch({ type: "AUTHENTICATE", response: response.data.data });
    }
  };
  const deleteIntegration = async () => {
    const response = await axios.delete(
      "https://us-central1-socialpanel-1ecb9.cloudfunctions.net/app/api/v1/accounts/authenticate",
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    if(response.data.statusCode == 200){
        dispatch({ type: "LOGOUT" });
    }
  };
  useState(() => {
    isAlreadyAuthenticated();
  }, []);
  const signOut = () => {
    deleteIntegration();
  };
  const redirectToPortal = (item) => {
    navigate("/portal", { state: { page: item } });
  };
  return (
    <div>
      <div className="container-fluid d-flex justify-content-center align-items-center">
        {!isLoggedin && (
          <div className="form-container">
            <div className="header-container my-4">
              <div>Facebook Page Integration</div>
            </div>
            <div className="form-input-container mt-5">
              <FacebookLogin
                appId="1526072548139602"
                autoLoad={false}
                cookie={true}
                xfbml={true}
                cssClass="btn btn-primary w-100"
                textButton="Connect Page"
                fields="name,email,picture,accounts,permissions"
                scope="pages_manage_posts,pages_manage_metadata,pages_read_engagement,pages_messaging"
                callback={responseFacebook}
              />
            </div>
          </div>
        )}
        {isLoggedin && (
          <div className="form-container">
            <div className="header-container my-3">
              <div>Facebook Page Integration</div>
            </div>
            <div className="sub-header-container p-2 d-flex justify-content-center">
              <div>Integrated Page :</div>
              <div className="mx-1 clientName">
                {pageList.length > 0 ? pageList[0].name : ""}
              </div>
            </div>
            <div className="form-input-container my-1 d-flex">
              <button onClick={signOut} className="btn btn-danger w-100 my-2">
                Delete Integration
              </button>
            </div>
            <div className="form-input-container my-1 d-flex">
              <button
                onClick={() => redirectToPortal(pageList[0])}
                className="btn btn-primary w-100 mb-3"
              >
                Reply to Messages
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
