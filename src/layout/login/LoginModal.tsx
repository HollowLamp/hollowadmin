import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { isAuthenticatedAtom, tokenAtom } from "@/store/authAtom";
import { login } from "@/api/auth";
import axios from "axios";

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ opened, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setToken = useSetAtom(tokenAtom);

  const handleLogin = async () => {
    try {
      const token = await login(username, password);
      localStorage.setItem("authToken", token);
      setToken(token);
      setIsAuthenticated(true);
      setError(null);
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "登录失败，请检查用户名和密码");
      } else {
        setError("登录失败，请检查网络或稍后重试");
      }
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="登录" centered>
      <TextInput
        label="用户名"
        placeholder="请输入用户名"
        value={username}
        onChange={(event) => setUsername(event.currentTarget.value)}
      />
      <PasswordInput
        label="密码"
        placeholder="请输入密码"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        mt="md"
      />
      {error && (
        <Text c="red" size="sm" mt="sm">
          {error}
        </Text>
      )}{" "}
      <Group mt="md">
        <Button onClick={handleLogin}>登录</Button>
      </Group>
    </Modal>
  );
};

export default LoginModal;
