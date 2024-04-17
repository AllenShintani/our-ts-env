import type * as React from 'react'
import { styled } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import { Menu, MenuOpen } from '@mui/icons-material'
import { Navigator } from '@/components/admin/home/listitems'
import Box from '@mui/material/Box'

const DRAWERWIDTH = 240

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: DRAWERWIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7),
      },
    }),
  },
}))

type AdminDrawerProps = {
  open: boolean
  toggleDrawer: () => void
  mobileOpen: boolean
  handleDrawerToggle: () => void
  isSmUp: boolean
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  open,
  toggleDrawer,
  mobileOpen,
  handleDrawerToggle,
  isSmUp,
}) => {
  return (
    <Drawer
      variant="permanent"
      open={open}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [0.5],
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          sx={{
            color: '#809FB8',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {open ? <MenuOpen /> : <Menu />}
        </IconButton>
      </Toolbar>
      <Box>
        {isSmUp ? null : (
          <Navigator
            PaperProps={{ style: { width: DRAWERWIDTH } }}
            variant="permanent"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        )}
        <Navigator
          PaperProps={{ style: { width: DRAWERWIDTH } }}
          sx={{ display: { sm: 'block', xs: 'none' } }}
        />
      </Box>
    </Drawer>
  )
}
