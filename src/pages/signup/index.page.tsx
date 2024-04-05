import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { FormEvent } from 'react'
import axios from 'axios'
import Router from 'next/router'
import firebase from '@firebase/app-compat'
import 'firebase/compat/auth'
import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  sendEmailVerification,
} from '@firebase/auth'
import { auth } from 'backend/components/lib/firebase/firebase'
import type { User } from 'backend/types/User'
const API_HOST = `${process.env.NEXT_PUBLIC_API_HOST}`
const theme = createTheme()
const router = Router

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)

  const userData: User = {
    email: formData.get('email')?.toString() || ``,
    password: formData.get('password')?.toString() || ``,
    firstName: formData.get('lastName')?.toString(),
    lastName: formData.get('firstName')?.toString(),
  }

  try {
    // ユーザーを登録
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData['email'] as string,
      userData['password'] as string,
    )

    // トークンを取得
    const user = userCredential.user
    const idToken = await getIdToken(user)

    // バックエンドにトークンとユーザー情報を送信
    const response = await axios.post(`${API_HOST}/signup`, {
      token: idToken,
      userData: userData,
    })

    if (response.status === 200) {
      router.push('/')
    } else {
      console.error('ユーザー登録に失敗しました')
    }
  } catch (error) {
    console.error('エラーが発生しました', error)
  }
}

export default function SignUp() {
  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
          >
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  autoComplete="given-name"
                  name="lastName"
                  required
                  fullWidth
                  id="lastName"
                  label="姓"
                  autoFocus
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="名"
                  name="firstName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="メールアドレス"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>

              <Grid
                item
                xs={12}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value="allowExtraEmails"
                      color="primary"
                    />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              登録
            </Button>
            <Grid
              container
              justifyContent="flex-end"
            >
              <Grid item>
                <a href="/rooting/Signin">既にアカウントをお持ちの方</a>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
