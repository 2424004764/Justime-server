import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { UserController } from '../controllers/user.controller'

const router = new Hono<AppEnv>()

// 微信小程序登录：用 code 换 openid，登录或注册用户
router.post('/user/login', UserController.login)

export default router
