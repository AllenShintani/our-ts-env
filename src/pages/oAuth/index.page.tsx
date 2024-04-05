import type React from 'react'
import axios from 'axios'

const GoogleLogin: React.FC = () => {
  const handleLogin = () => {
    // Google認証のエンドポイントにリダイレクトします
    window.location.href = 'http://localhost:8080/login/google'
  }

  const handleLogout = async () => {
    try {
      // ログアウトのAPIエンドポイントを呼び出します
      await axios.post('http://localhost:8080/logout')
      // ログアウト後の処理を行います（例: ユーザー情報をクリア）
      // ...
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  const fetchUserInfo = async () => {
    try {
      // ユーザー情報を取得するAPIエンドポイントを呼び出します
      const response = await axios.get('http://localhost:8080/user')
      const userInfo = response.data
      // 取得したユーザー情報を表示するなどの処理を行います
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error)
    }
  }

  return (
    <div>
      <button onClick={handleLogin}>Googleでログイン</button>
      <button onClick={handleLogout}>ログアウト</button>
      <button onClick={fetchUserInfo}>ユーザー情報を取得</button>
    </div>
  )
}

export default GoogleLogin
