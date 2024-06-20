import { useState, useEffect } from "react";
import authService from "../services/auth.service";


const ProfileComponent = ({currentUser, setCurrentUser}) => {

  return (
      <div style={{ padding: "3rem" }}>
      {!currentUser && <div>在获取您的个人资料之前，您必须先登陆。</div>}
      {currentUser && (
        <div>
          <h2>以下是您的个人档案：</h2>

          <table className="table">
            <tbody>
              <tr>
                <td>
                  <strong>姓名：{currentUser.user.username}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>您的用戶ID: {currentUser.user._id}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>您注册的邮箱: {currentUser.user.email}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>身份: {currentUser.user.role}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
