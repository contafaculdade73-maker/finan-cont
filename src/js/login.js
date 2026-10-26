/**
 * ==========================================================================
 * FinanCont - Lógica da Tela de Login
 * Arquivo: login.js
 * Descrição: Validações de formulário no cliente, feedback de erros,
 *            alternância de visibilidade da senha e simulação de autenticação.
 * ==========================================================================
 */

// Executa o script apenas após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. Constantes de Usuário e Credenciais Simuladas
  // ------------------------------------------------------------------------
  const CREDENCIAIS_VALIDAS = {
    email: 'admin@financont.com',
    senha: '123456'
  };

  // URL de destino após autenticação bem-sucedida
  const URL_DASHBOARD = 'dashboard.html';

  // ------------------------------------------------------------------------
  // 2. Mapeamento dos Elementos do DOM
  // ------------------------------------------------------------------------
  const formLogin = document.getElementById('form-login');
  const inputEmail = document.getElementById('email');
  const inputSenha = document.getElementById('senha');
  const erroEmail = document.getElementById('erro-email');
  const erroSenha = document.getElementById('erro-senha');
  const alertaGeral = document.getElementById('alerta-geral');
  const alertaGeralTexto = document.getElementById('alerta-geral-texto');
  const btnEntrar = document.getElementById('btn-entrar');
  const btnToggleSenha = document.getElementById('btn-toggle-senha');
  const linkEsqueciSenha = document.getElementById('link-esqueci-senha');
  const cardLogin = document.querySelector('.login-card');

  // ------------------------------------------------------------------------
  // 3. Funções Auxiliares de Validação e Limpeza de Erros
  // ------------------------------------------------------------------------

  /**
   * Valida se uma string possui o formato básico de e-mail válido.
   * Exemplo aceito: usuario@dominio.com
   * @param {string} email
   * @returns {boolean}
   */
  function validarFormatoEmail(email) {
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padraoEmail.test(email);
  }

  /**
   * Exibe mensagem de erro abaixo de um campo específico e aplica estilo visual.
   * @param {HTMLInputElement} inputElement
   * @param {HTMLElement} errorElement
   * @param {string} mensagem
   */
  function exibirErroCampo(inputElement, errorElement, mensagem) {
    inputElement.classList.add('input-erro');
    inputElement.setAttribute('aria-invalid', 'true');
    errorElement.textContent = mensagem;
  }

  /**
   * Limpa o erro de um campo específico e remove o estilo de erro.
   * @param {HTMLInputElement} inputElement
   * @param {HTMLElement} errorElement
   */
  function limparErroCampo(inputElement, errorElement) {
    inputElement.classList.remove('input-erro');
    inputElement.removeAttribute('aria-invalid');
    errorElement.textContent = '';
  }

  /**
   * Exibe a mensagem de erro geral (ex.: "E-mail ou senha incorretos").
   * @param {string} mensagem
   */
  function exibirAlertaGeral(mensagem) {
    alertaGeralTexto.textContent = mensagem;
    alertaGeral.removeAttribute('hidden');

    // Efeito de vibração sutil no alerta para feedback do usuário
    alertaGeral.classList.remove('shake-anim');
    // Força reflow para reiniciar a animação CSS
    void alertaGeral.offsetWidth;
    alertaGeral.classList.add('shake-anim');
  }

  /**
   * Oculta o alerta geral de erro.
   */
  function ocultarAlertaGeral() {
    alertaGeral.setAttribute('hidden', '');
    alertaGeralTexto.textContent = '';
  }

  // ------------------------------------------------------------------------
  // 4. Limpeza de erros em tempo real enquanto o usuário digita
  // ------------------------------------------------------------------------
  inputEmail.addEventListener('input', () => {
    limparErroCampo(inputEmail, erroEmail);
    ocultarAlertaGeral();
  });

  inputSenha.addEventListener('input', () => {
    limparErroCampo(inputSenha, erroSenha);
    ocultarAlertaGeral();
  });

  // ------------------------------------------------------------------------
  // 5. Alternar visibilidade da senha (mostrar / ocultar)
  // ------------------------------------------------------------------------
  if (btnToggleSenha) {
    btnToggleSenha.addEventListener('click', () => {
      const tipoAtual = inputSenha.getAttribute('type');
      const novoTipo = tipoAtual === 'password' ? 'text' : 'password';
      inputSenha.setAttribute('type', novoTipo);

      // Atualiza o ícone SVG de acordo com o estado
      if (novoTipo === 'text') {
        btnToggleSenha.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        `;
        btnToggleSenha.setAttribute('aria-label', 'Ocultar senha');
      } else {
        btnToggleSenha.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        `;
        btnToggleSenha.setAttribute('aria-label', 'Mostrar senha');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 6. Comportamento visual do link "Esqueci minha senha"
  // ------------------------------------------------------------------------
  if (linkEsqueciSenha) {
    linkEsqueciSenha.addEventListener('click', (evento) => {
      evento.preventDefault();

      // Exibe uma mensagem informativa amigável para o usuário
      let avisoExistente = document.getElementById('aviso-esqueci-senha');
      if (!avisoExistente) {
        avisoExistente = document.createElement('div');
        avisoExistente.id = 'aviso-esqueci-senha';
        avisoExistente.className = 'toast-info';
        avisoExistente.setAttribute('role', 'status');
        avisoExistente.innerHTML = 'Para redefinir sua senha, solicite suporte ao administrador pelo e-mail: <strong>admin@financont.com</strong>.';
        formLogin.parentNode.insertBefore(avisoExistente, formLogin.nextSibling);

        // Remove automaticamente após 6 segundos
        setTimeout(() => {
          if (avisoExistente && avisoExistente.parentNode) {
            avisoExistente.remove();
          }
        }, 6000);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 7. Envio do Formulário e Validações
  // ------------------------------------------------------------------------
  formLogin.addEventListener('submit', (evento) => {
    // Interrompe o envio padrão do formulário HTML
    evento.preventDefault();

    // Limpa erros anteriores
    limparErroCampo(inputEmail, erroEmail);
    limparErroCampo(inputSenha, erroSenha);
    ocultarAlertaGeral();

    // Obtém os valores dos campos removendo espaços extras
    const emailValor = inputEmail.value.trim();
    const senhaValor = inputSenha.value;

    let formularioValido = true;
    let primeiroCampoInvalido = null;

    // Validação do campo de E-mail
    if (!emailValor) {
      exibirErroCampo(inputEmail, erroEmail, 'O campo de e-mail é obrigatório.');
      formularioValido = false;
      primeiroCampoInvalido = inputEmail;
    } else if (!validarFormatoEmail(emailValor)) {
      exibirErroCampo(inputEmail, erroEmail, 'Informe um e-mail válido (ex.: usuario@dominio.com).');
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = inputEmail;
    }

    // Validação do campo de Senha
    if (!senhaValor) {
      exibirErroCampo(inputSenha, erroSenha, 'O campo de senha é obrigatório.');
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = inputSenha;
    }

    // Se houver algum erro de validação nos campos, foca no primeiro campo com erro
    if (!formularioValido) {
      if (primeiroCampoInvalido) {
        primeiroCampoInvalido.focus();
      }
      return;
    }

    // ----------------------------------------------------------------------
    // 8. Simulação de Autenticação com Credenciais Válidas
    // ----------------------------------------------------------------------
    // Validação de credenciais: admin@financont.com e senha 123456
    const emailCorreto = emailValor.toLowerCase() === CREDENCIAIS_VALIDAS.email.toLowerCase();
    const senhaCorreta = senhaValor === CREDENCIAIS_VALIDAS.senha;

    if (emailCorreto && senhaCorreta) {
      // Feedback visual de carregamento no botão
      btnEntrar.disabled = true;
      btnEntrar.innerHTML = `
        <span class="spinner" aria-hidden="true"></span>
        <span>Entrando...</span>
      `;

      // Armazena sessão simulada para navegação
      try {
        sessionStorage.setItem('financont_usuario', JSON.stringify({
          email: CREDENCIAIS_VALIDAS.email,
          nome: 'Administrador',
          perfil: 'admin',
          dataLogin: new Date().toISOString()
        }));
      } catch (err) {
        // Fallback caso sessionStorage não esteja disponível
        console.warn('Armazenamento de sessão não disponível:', err);
      }

      // Pequeno atraso intencional (350ms) para sensação natural de autenticação
      setTimeout(() => {
        window.location.href = URL_DASHBOARD;
      }, 350);

    } else {
      // Credenciais incorretas: exibe erro geral
      exibirAlertaGeral('E-mail ou senha incorretos.');

      // Destaca ambos os campos com borda de erro para clareza
      inputEmail.classList.add('input-erro');
      inputSenha.classList.add('input-erro');

      // Coloca foco no campo de e-mail para permitir nova tentativa
      inputEmail.focus();
      inputEmail.select();
    }
  });

});
