// Frontend - App.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import Form from "./components/Form";
import Grid from "./components/Grid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;      
  min-height: 100vh;        
  gap: 20px;                
  padding: 20px;            
  box-sizing: border-box;   
  width: 100%;              
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 0;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 300px;
  margin-bottom: 20px;
  border: 1px solid #bbb;
  border-radius: 5px;
`;

function App() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [search, setSearch] = useState(""); // Estado de pesquisa

  // Função para obter os usuários, agora com suporte à busca
  const getUsers = useCallback(async (signal, nome = "") => {
    try {
      const res = await axios.get("http://localhost:8800", {
        params: { nome }, // Passa o nome como parâmetro da query
        signal,
      });
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        toast.error("Erro ao buscar usuários. Por favor, tente novamente.");
      }
    }
  }, []);

  // Efeito para obter os usuários toda vez que o valor de pesquisa mudar
  useEffect(() => {
    const abortController = new AbortController();
    getUsers(abortController.signal, search); // Passa o valor de pesquisa para a função
    return () => {
      abortController.abort();
    };
  }, [getUsers, search]); // Atualiza a lista sempre que a pesquisa mudar

  return (
    <>
      <Container>
        <Title>USUÁRIOS</Title>
        {/* Campo de busca */}
        <SearchInput
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
        />
        {/* Formulário para adicionar e editar usuários */}
        <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
        {/* Tabela de usuários */}
        <Grid setOnEdit={setOnEdit} users={users} setUsers={setUsers} />
      </Container>
      <ToastContainer autoClose={3000} position="bottom-left" />
    </>
  );
}

export default App;
