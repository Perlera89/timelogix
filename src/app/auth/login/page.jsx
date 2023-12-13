'use client'
import { useState, useContext } from 'react'
import { Form, Input, Button, message } from 'antd'
import { useRouter } from 'next/navigation'
import Result from '@/components/common/Result'
import axios from 'axios'
import { LOGIN_ROUTE } from '@/utils/apiRoutes'
import { UserContext } from '@/utils/userContext'

// import { user } from '@/utils/user'

const LoginForm = () => {
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()
  const { user, setUser } = useContext(UserContext)

  const router = useRouter()

  const handleOpenResult = () => {
    setOpenResult(true)
  }

  const handleCloseResult = () => {
    setOpenResult(false)
  }
  const onFinish = async (values) => {
    // user.email = values.email
    axios
      .post(LOGIN_ROUTE, values)
      .then((res) => {
        setUser(res.data)
        messageApi.open({
          type: 'loading',
          content: 'Login successfully',
          duration: 10
        })
        router.push('/pages/timesheet')
      })
      .catch((err) => {
        setError(err)
        handleOpenResult()
      })
  }

  return (
    <div className="mx-auto min-w-[500px] bg-poor-black pt-10 pb-4 px-8 rounded-lg">
      <h1 className="text-4xl text-center text-ghost-white mb-8">Sign in</h1>
      <Form name="login" onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not a valid email!'
            },
            {
              required: true,
              message: 'Please input your email!'
            }
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!'
            }
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            className="bg-tomato mt-2"
            htmlType="submit"
            size="large"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Result
        title={error ? error?.response?.data?.message : null}
        subtitle={error ? error?.message : null}
        error={error ? error.stack : null}
        open={openResult}
        handleClose={handleCloseResult}
      />
      {contextHolder}
    </div>
  )
}

export default LoginForm
