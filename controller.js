// Array para armazenar os dados dos usuários
var dadosLista = [];
// Validação de email usando regex
function validaEmail(email) {
   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return regex.test(email);
}
// Validação de CPF com cálculo dos dígitos verificadores
function validaCPF(cpf) {
   cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
   if (cpf.length !== 11) return false;
   // Verificação dos dígitos verificadores
   let soma = 0;
   let resto;
   // Primeiro dígito verificador
   for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
   resto = (soma * 10) % 11;
   if ((resto === 10) || (resto === 11)) resto = 0;
   if (resto !== parseInt(cpf.substring(9, 10))) return false;
   soma = 0;
   // Segundo dígito verificador
   for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
   resto = (soma * 10) % 11;
   if ((resto === 10) || (resto === 11)) resto = 0;
   if (resto !== parseInt(cpf.substring(10, 11))) return false;
   return true;
}
// Função para salvar o usuário no cadastro
function salvarUser() {
   let nomeUser = document.getElementById('nomeUser').value;
   let emailUser = document.getElementById('emailUser').value;
   let senhaUser = document.getElementById('senhaUser').value;
   let cpfUser = document.getElementById('cpfUser').value;
   let dataNascUser = document.getElementById('dataNascUser').value;
   let enderecoUser = document.getElementById('enderecoUser').value;
   // Validação dos campos de entrada
   if (nomeUser && emailUser && senhaUser && cpfUser && dataNascUser && enderecoUser) {
       if (!validaEmail(emailUser)) {
           alert("Email inválido");
           return;
       }
       if (!validaCPF(cpfUser)) {
           alert("CPF inválido");
           return;
       }
       // Adiciona o usuário à lista de dados
       dadosLista.push({
           nome: nomeUser,
           email: emailUser,
           senha: senhaUser,  // Por questões de segurança, evite armazenar senhas sem criptografia
           cpf: cpfUser,
           dataNasc: dataNascUser,
           endereco: enderecoUser
       });
       console.log(dadosLista);
       criaLista();
       // Limpa o formulário
       document.getElementById('cadastroForm').reset();
   } else {
       alert("Preencha todos os campos corretamente");
   }
}
// Função para criar a lista de usuários e atualizar a tabela
function criaLista() {
   let tabela = "<tr><th>Nome</th><th>Email</th><th>CPF</th><th>Data de Nascimento</th><th>Endereço</th><th>Ações</th></tr>";
   for (let i = 0; i < dadosLista.length; i++) {
       tabela += `<tr>
<td>${dadosLista[i].nome}</td>
<td>${dadosLista[i].email}</td>
<td>${dadosLista[i].cpf}</td>
<td>${dadosLista[i].dataNasc}</td>
<td>${dadosLista[i].endereco}</td>
<td><button onclick="editar(${i})">Editar</button><button onclick="excluir(${i})">Excluir</button></td>
</tr>`;
   }
   document.getElementById('tabela').innerHTML = tabela;
}
// Função para editar os dados da lista
function editar(i) {
   document.getElementById('nomeUser').value = dadosLista[i].nome;
   document.getElementById('emailUser').value = dadosLista[i].email;
   document.getElementById('senhaUser').value = dadosLista[i].senha;
   document.getElementById('cpfUser').value = dadosLista[i].cpf;
   document.getElementById('dataNascUser').value = dadosLista[i].dataNasc;
   document.getElementById('enderecoUser').value = dadosLista[i].endereco;
   dadosLista.splice(i, 1);
   criaLista();
}
// Função para excluir o usuário da lista
function excluir(i) {
   dadosLista.splice(i, 1);
   criaLista();
}
// Função que busca o endereço com base no CEP usando a API ViaCEP
function buscaEndereco(cep) {
   fetch(`https://viacep.com.br/ws/${cep}/json/`)
       .then(response => response.json())
       .then(data => {
           if (!data.erro) {
               document.getElementById('enderecoUser').value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
           } else {
               alert("CEP inválido!");
           }
       })
       .catch(error => {
           alert("Erro ao buscar o CEP");
           console.log(error);
       });
}
// Evento para buscar o endereço ao sair do campo CEP
document.getElementById('cepUser')?.addEventListener('blur', function () {
   let cep = this.value.replace(/\D/g, '');
   if (cep) {
       buscaEndereco(cep);
   }
});
// Função para autenticar o login
function autenticar() {
   let loginEmail = document.getElementById('loginEmail').value;
   let loginSenha = document.getElementById('loginSenha').value;
   // Verifica se o email e a senha estão cadastrados
   let usuarioEncontrado = dadosLista.find(user => user.email === loginEmail && user.senha === loginSenha);
   if (usuarioEncontrado) {
       alert("Login realizado com sucesso!");
       // Aqui você pode redirecionar o usuário para uma página de dashboard ou outra página de sucesso
   } else {
       alert("Email ou senha incorretos. Tente novamente.");
   }
}
// Função para redirecionar para a página de cadastro
function redirecionarParaCadastro() {
   window.location.href = 'cadastro.html'; // Certifique-se de que o caminho para o arquivo cadastro.html está correto
}
// Adiciona o evento de clique ao botão de login para redirecionar para a página de cadastro
document.getElementById('acessarBtn').addEventListener('click', function () {
   redirecionarParaCadastro();
});