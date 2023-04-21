import { Container, Flex, PasswordInput, Stack, Text, useMantineTheme } from '@mantine/core'
import { FC } from 'react'
import * as Yup from 'yup'
import { useForm, yupResolver } from '@mantine/form'
import { TextInput, Button, Group } from '@mantine/core'
import { AuthProps, ISignUp } from '../../interfaces/LoginTypes'
import { IAuthValues, useAuth } from '../../context/AuthProvider'

const schema = Yup.object().shape({
  name: Yup.string().min(2, 'Name should have at least 2 letters'),
  email: Yup.string()
    .matches(
      /^((([0-9A-Za-z]{1}[-0-9A-z.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,})\.{1,2}[-A-Za-z]{2,})$/u,
      'Invalid email',
    )
    .email('Invalid email'),
  password: Yup.string().min(2, 'Password should have at least 2 letters'),
})

export const SignUp: FC<AuthProps> = ({ setRegister }) => {
  const { signUp, error }: IAuthValues = useAuth()
  const theme = useMantineTheme()

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const handleSignUp = (values: ISignUp) => {
    signUp(values)
  }

  const toggleRegister = () => {
    setRegister((prev) => !prev)
  }

  return (
    <Container mt='1rem'>
      <Flex justify='center' gap='md'>
        <Stack
          pb='1.5rem'
          style={{
            background: theme.fn.linearGradient(45, 'red', 'blue'),
            flex: '1 1 50%',
            color: 'white',
            borderRadius: '10px',
          }}
          align='center'
          justify='center'
        >
          <Text fz='2rem' align='center'>
            Привет!
          </Text>
          <Text fz='1.5rem' align='center'>
            Добро пожаловать!
          </Text>
          <Text align='center'>Если Вы уже зарегистрированы, войдите в свою учетную запись</Text>
          <Button onClick={toggleRegister} type='submit'>
            Войти
          </Button>
        </Stack>
        <Stack style={{ flex: '1 1 50%' }}>
          <Text align='center' fz='1.2rem' fw='600'>
            Зарегистрироваться
          </Text>
          {error && <div style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}
          <form onSubmit={form.onSubmit((values) => handleSignUp(values))}>
            <TextInput withAsterisk label='Name' placeholder='John Doe' mt='sm' {...form.getInputProps('name')} />
            <TextInput withAsterisk label='Email' placeholder='example@mail.com' {...form.getInputProps('email')} />
            <PasswordInput withAsterisk label='Password' placeholder='Password' {...form.getInputProps('password')} />

            <Group position='right' mt='xl'>
              <Button type='submit'>Зарегистрироваться</Button>
            </Group>
          </form>
        </Stack>
      </Flex>
    </Container>
  )
}
