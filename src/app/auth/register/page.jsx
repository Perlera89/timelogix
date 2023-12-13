'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { REGISTER_ROUTE } from '@/utils/apiRoutes'
import { Input, Form, Button } from 'antd'
import axios from 'axios'

import Result from '@/components/common/Result'

const RegisterPage = () => {
  const [error, setError] = useState('')
  const [openResult, setOpenResult] = useState(false)

  const router = useRouter()

  const handleOpenResult = () => {
    setOpenResult(true)
  }

  const handleCloseResult = () => {
    setOpenResult(false)
  }

  const handleFinish = async (values) => {
    await axios
      .post(REGISTER_ROUTE, values)
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          router.push('/auth/login')
        }
      })
      .catch((err) => {
        console.log('error :>> ', err)
        setError(err)
        handleOpenResult()
      })
  }

  return (
    <>
      <div className="mx-auto min-w-[500px] bg-poor-black pt-10 pb-4 px-8 rounded-lg">
        <h1 className="text-4xl text-center text-ghost-white mb-8">
          Create account
        </h1>
        <Form name="registration" onFinish={handleFinish} scrollToFirstError>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your name!'
              },
              {
                min: 4,
                message: 'Name must be at least 4 characters'
              }
            ]}
          >
            <Input
              showCount
              maxLength={100}
              size="large"
              placeholder="Name"
            />
          </Form.Item>

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
            <Input placeholder="email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              },
              {
                min: 8,
                message: 'Password must be at least 8 characters'
              }
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item
            name="repeatPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please repeat your password!'
              },
              ({ getFieldValue }) => ({
                validator (_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  )
                }
              })
            ]}
          >
            <Input.Password placeholder="Repeat Password" size="large" />
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
      </div>
    </>
  )
}

export default RegisterPage
