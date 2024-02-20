import React, { useEffect, useState } from "react";
import "./Portal.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
export const Portal = () => {
  const dispatch = useDispatch();
  const is_conversation_active = useSelector((state) => state.user.isConversationActive);
  const active_conversation = useSelector((state) => state.user.activeConversation);
  const conversation_list = useSelector((state) => state.user.conversationList);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const page = state && state.page;
  const picture = useSelector((state) => state.user.picture);
  // const [activeConversation, setActiveConversation] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState([]);
  const redirectToHome = () => {
    console.log("Redirect to home");
    console.log(picture);
  };
  const refresh = () => {
    getConversationUserList();
  };
  const getUserProfile = async (userId, access_token) => {
    const loginStatus = await checkAccessTokenExpired(
      page.id,
      page.access_token
    );
    console.log("loginStatus", loginStatus);
    if (!loginStatus) {
      const response = await axios.delete(
        "https://us-central1-socialpanel-1ecb9.cloudfunctions.net/app/api/v1/accounts/authenticate",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // console.log("Response from server: ", response.data);
      if (response.data.statusCode == 200) {
      }
      dispatch({ type: "LOGOUT" });
      navigate("/home");
    }
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${userId}?fields=first_name,last_name,profile_pic&access_token=${access_token}`
      );
      // console.log("response userdata", response.data);
      setUserProfile(response.data);
      return response.data;
    } catch (error) {}
  };

  const handleConversationClick = (conversation) => {
    getUserProfile(conversation.sender_id, page.access_token);
    dispatch({ type: "ACTIVE_CONVERSATION", response: conversation });
    dispatch({ type: "IS_CONVERSATION_ACTIVE", response: true });
    // console.log("active_conversation", active_conversation);
  };
  const reply = async () => {
    try {
      const response = await axios.post(
        "https://us-central1-socialpanel-1ecb9.cloudfunctions.net/app/api/v1/conversation/reponseMessage",
        {
          sender_id: active_conversation.sender_id,
          access_token: page.access_token,
          pageId: page.id,
          message: replyMessage,
        }
      );
      setReplyMessage("");
      getConversationUserList();
    } catch (error) {}
  };
  const checkAccessTokenExpired = async (pageId, access_token) => {
    try {
      let response = await axios.get(
        `https://graph.facebook.com/v8.0/me?access_token=${access_token}`
      );
      if (response.data.error) {
        console.log("Token Expired");
        return false;
      } else {
        console.log("Token not expired");
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const getToken = () => {
    return localStorage.getItem("token");
  };
  const getConversationUserList = async () => {
    try {
      const loginStatus = await checkAccessTokenExpired(
        page.id,
        page.access_token
      );
      if (!loginStatus) {
        const response = await axios.delete(
          "https://us-central1-socialpanel-1ecb9.cloudfunctions.net/app/api/v1/accounts/authenticate",
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (response.data.statusCode == 200) {
        }
        dispatch({ type: "LOGOUT" });
        navigate("/home");
      }
      const response = await axios.post(
        "https://us-central1-socialpanel-1ecb9.cloudfunctions.net/app/api/v1/conversations/user/list",
        {
          pageId: page.id,
          access_token: page.access_token,
        }
      );
      dispatch({ type: "CONVERSATION_LIST", response: response.data.data });
      // console.log("is conversation active", is_conversation_active);
      setIsRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };
  useState(() => {
    getConversationUserList();
  }, []);
  const calculateDuration = (time) => {
    const currentTime = new Date();
    const difference = new Date(time) - currentTime;
    const seconds = Math.floor(Math.abs(difference) / 1000);

    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h`;
    }
  };
  const formatDateTime = (time) => {
    const date = new Date(time);
    const options = {
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDateTime = date.toLocaleString("en-US", options);
    return formattedDateTime;
  };
  useEffect(() => {
    conversation_list.map((conversation, index) => {
      if (conversation.id === active_conversation?.id) {
        dispatch({ type: "ACTIVE_CONVERSATION", response: conversation });
      }
    });
    
  }, [conversation_list]);
  const updateConversationList = (is_active) => {
    if(is_active){
      getConversationUserList();
    }
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateConversationList(is_conversation_active);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [is_conversation_active]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      getConversationUserList();
    },5000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div>
      {true && (
        <div className="portal-container">
          <div className="sidebar-container">
            <div>
              <div onClick={redirectToHome} className="sidebar-logo-container">
                <img
                  width="30"
                  height="30"
                  src={require("../assets/richpanel-logo.jpg")}
                  alt=""
                  style={{ borderRadius: "2px" }}
                />
              </div>
              <div className="sidebar-navitems-container">
                <div className="navitems active">
                  <i className="fa-solid fa-inbox"></i>
                </div>
                <div className="navitems ">
                  <i className="fa-solid fa-user-group"></i>
                </div>
                <div className="navitems">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
              </div>
            </div>
            <div className="agent-logo-container">
              {true && (
                <img
                  width="40"
                  height="40"
                  style={{ borderRadius: "100%" }}
                  src={require("../assets/anshu_img_1.jpg")}
                  alt=""
                />
              )}

              <div className="active-dot"></div>
            </div>
          </div>
          <div className="conversation-container">
            {true && (
              <div className="coversation-thread-container">
                <div className="conversation-thread-header d-flex flex-row justify-content-between w-100">
                  <i className="fa-solid fa-bars "></i>
                  <div className="thread-header-text">Conversations</div>
                  <i
                    onClick={refresh}
                    className={`fa-solid fa-rotate ${
                      isRefreshing ? "rotate" : ""
                    }`}
                  ></i>
                </div>
                {true &&
                  conversation_list.map((conversation, index) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation)}
                      id={conversation.id}
                      className={`conversation-customer-container ${
                        conversation.id === active_conversation?.id
                          ? "container-active"
                          : ""
                      }`}
                    >
                      <div className="customer ">
                        <div className="customer-header">
                          <div className="customer-header-left d-flex justify-content-center align-items-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name=""
                              id=""
                              checked={
                                conversation.id === active_conversation?.id
                              }
                            />
                          </div>
                          <div className="customer-header-right w-100 d-flex flex-row justify-content-between align-items-center">
                            <div className="customer-name-container">
                              <div className="customer-name">
                                {conversation.first_name +
                                  " " +
                                  conversation.last_name}
                              </div>
                              <div className="message-src">facebook DM</div>
                            </div>
                            <div className="customer-time">
                              {calculateDuration(
                                conversation.messages[
                                  conversation.messages.length - 1
                                ].time
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="customer-footer">
                          <div className="thread-main-text"></div>
                          <div className="thread-subtext">
                            {
                              conversation.messages[
                                conversation.messages.length - 1
                              ].text
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {is_conversation_active && (
              <div className="conversation-text-container">
                <div className="conversation-container-header">
                  {active_conversation.first_name +
                    " " +
                    active_conversation.last_name}
                </div>
                <div className="conversation-box-container">
                  <div className="chat-container row m-0 p-3 w-100">
                    {active_conversation.messages.map((message, index) => (
                      <div
                        key={message.mid}
                        className={`chat-message d-flex p-0 ${
                          message.sender_id == active_conversation.page_id
                            ? "admin"
                            : "user"
                        }`}
                      >
                        <div className="message-container">
                          <div
                            className={`d-flex align-items-center ${
                              message.sender_id == active_conversation.page_id
                                ? `flex-row-reverse ${
                                    (
                                      index + 1 <=
                                      active_conversation.messages.length - 1
                                        ? message.sender_id !=
                                        active_conversation.messages[index + 1]
                                            .sender_id
                                        : true
                                    )
                                      ? ""
                                      : "margin-right"
                                  }`
                                : `${
                                    (
                                      index + 1 <=
                                      active_conversation.messages.length - 1
                                        ? message.sender_id !=
                                        active_conversation.messages[index + 1]
                                            .sender_id
                                        : true
                                    )
                                      ? ""
                                      : "margin-left"
                                  }`
                            } `}
                            style={{ columnGap: "0.5rem" }}
                          >
                            {message.sender_id !== active_conversation.page_id &&
                              (index + 1 <=
                                active_conversation.messages.length - 1
                                ? message.sender_id !=
                                active_conversation.messages[index + 1]
                                    .sender_id
                                : true) && (
                                <img
                                  className="chat-img"
                                  width="30"
                                  height="30"
                                  loading="lazy"
                                  src={require("../assets/anshu_img_2.jpg")}
                                  alt=""
                                />
                              )}
                            {message.sender_id == active_conversation.page_id &&
                              (index + 1 <=
                                active_conversation.messages.length - 1
                                ? message.sender_id !=
                                active_conversation.messages[index + 1]
                                    .sender_id
                                : true) && (
                                <img
                                  className="chat-img"
                                  width="30"
                                  height="30"
                                  src={require("../assets/anshu_img.jpg")}
                                  alt=""
                                />
                              )}
                            <span className="message-text">{message.text}</span>
                            <span></span>
                          </div>
                          <div
                            className={`d-flex message-sender-container ms1 ${
                              message.sender_id === active_conversation.page_id
                                ? "justify-content-end margin-right-1"
                                : "margin-left-1"
                            }`}
                          >
                            {message.sender_id == active_conversation.page_id &&
                              (index + 1 <=
                                active_conversation.messages.length - 1
                                ? message.sender_id !=
                                active_conversation.messages[index + 1]
                                    .sender_id
                                : true) && (
                                <div className="message-sender">
                                  {active_conversation.first_name +
                                    " " +
                                    active_conversation.last_name}
                                </div>
                              )}
                            {message.sender_id !== active_conversation.page_id &&
                              (index + 1 <=
                                active_conversation.messages.length - 1
                                ? message.sender_id !=
                                active_conversation.messages[index + 1]
                                    .sender_id
                                : true) && (
                                <div className="message-sender">
                                  {active_conversation.first_name +
                                    " " +
                                    active_conversation.last_name}
                                </div>
                              )}
                            {(index + 1 <=
                            active_conversation.messages.length - 1
                              ? message.sender_id !=
                              active_conversation.messages[index + 1].sender_id
                              : true) && (
                              <div className="message-time">
                                <span className="mx-1">-</span>{" "}
                                {formatDateTime(message.time)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="input-container">
                    <input
                      type="text"
                      className="form-control"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          reply();
                        }
                      }}
                      placeholder={
                        "Message " +
                        userProfile.first_name +
                        " " +
                        userProfile.last_name
                      }
                      aria-label="Reply"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                </div>
              </div>
            )}
            {is_conversation_active && (
              <div className="customer-profile-container">
                <div className="customer-profile-header">
                  <div className="customer-logo-container">
                    <img
                      style={{ borderRadius: "100%" }}
                      width="40"
                      height="40"
                      src={require("../assets/anshu_img_2.jpg")}
                      alt=""
                    />
                  </div>
                  <div className="customer-name mt-2">
                    {userProfile.first_name + " " + userProfile.last_name}
                  </div>
                  <div className="customer-active-status d-flex align-items-center">
                    <div className="customer-active-status-dot"></div>
                    <div className="customer-active-status-text">Offline</div>
                  </div>
                  <div className="customer-action-btn-container mt-3 d-flex">
                    <div className="customer-action-btn">
                      <i className="fa-solid fa-phone"></i>
                      <div className="mx-2">call</div>
                    </div>
                    <div className="customer-action-btn">
                      <i className="fa-solid fa-circle-user"></i>
                      <div className="mx-2">Profile</div>
                    </div>
                  </div>
                </div>
                <div className="customer-details-container-wrapper">
                  <div className="customer-details-container">
                    <div className="customer-details-header">
                      Customer Details
                    </div>
                    <div className="customer-details">
                      <div className="d-flex justify-content-between">
                        <div className="label">Email</div>
                        <div className="value">anshusinha872@gmail.com</div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="label">First Name</div>
                        <div className="value">{userProfile.first_name}</div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="label">Last Name</div>
                        <div className="value">{userProfile.last_name}</div>
                      </div>
                      <div className="more-details-text">View more details</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
