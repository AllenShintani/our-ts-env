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
import 'firebase/compat/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'backend/components/lib/firebase/firebase'
import dotenv from 'dotenv'

dotenv.config()
const theme = createTheme()
const API_HOST = `${process.env.NEXT_PUBLIC_API_HOST}`
const router = Router

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  //----------formのデータを取り出す
  const formData = new FormData(e.currentTarget)
  const email =
    (formData.get('email') && formData.get('email')?.toString()) || ''
  const password =
    (formData.get('password') && formData.get('password')?.toString()) || ''

  const userData = {
    email: email,
    password: password,
  }
  //--------user情報をserverに送信
  const sendToServer = () => {
    axios
      .post(`${API_HOST}/signup`, userData)
      .then(async () => {
        router.push('/')
      })
      .catch((err) => {
        console.error(err)
      })
  }
  const authenticate = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user
      const token = await user.getIdToken()
      localStorage.setItem('token', token)
      router.push('/')
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }
  authenticate(userData.email, userData.password)
  sendToServer()
}

export default function SignIn() {
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
            Sign in
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
              ログイン
            </Button>
            <Grid
              container
              justifyContent="flex-end"
            >
              <Grid item>
                <a href="/rooting/signup">まだアカウントをお持ちでない方</a>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
