/**
 * ==============================================================================
 * FinanCont - Gerenciador do Formulário de Novo Lançamento
 * 
 * Regras de Negócio e Validações:
 * - Tipo: obrigatório (receita ou despesa).
 * - Descrição: obrigatória (não vazia).
 * - Valor: obrigatório, numérico e estritamente maior que zero (> 0).
 * - Data: obrigatória (formato válido).
 * - Categoria: obrigatória (Vendas, Aluguel, Salários, Impostos ou Outros).
 * - Status: pendente ou pago.
 * 
 * Ao submeter com sucesso:
 * 1. Constrói o objeto com os dados.
 * 2. Exibe o objeto no console do navegador.
 * 3. Mostra uma mensagem de confirmação/sucesso na interface.
 * 4. Limpa todos os campos do formulário e estados de erro.
 * ==============================================================================
 */

// Garante a execução em modo estrito para evitar variáveis globais indesejadas
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Referências aos elementos principais do formulário
  const formulario = document.querySelector("#form-lancamento");
  const grupoTipo = document.querySelector("#grupo-tipo");
  const radiosTipo = document.querySelectorAll('input[name="tipo"]');
  const campoDescricao = document.querySelector("#descricao");
  const campoValor = document.querySelector("#valor");
  const campoData = document.querySelector("#data");
  const campoCategoria = document.querySelector("#categoria");
  const campoStatus = document.querySelector("#status");
  const botaoLimpar = document.querySelector("#btn-limpar");

  // Referências aos contêineres de mensagens de erro
  const erroTipo = document.querySelector("#erro-tipo");
  const erroDescricao = document.querySelector("#erro-descricao");
  const erroValor = document.querySelector("#erro-valor");
  const erroData = document.querySelector("#erro-data");
  const erroCategoria = document.querySelector("#erro-categoria");
  const erroStatus = document.querySelector("#erro-status");

  // Referências do alerta de sucesso
  const alertaSucesso = document.querySelector("#mensagem-sucesso");
  const alertDetalhes = document.querySelector("#alert-detalhes");
  const btnFecharSucesso = document.querySelector("#btn-fechar-sucesso");

  /**
   * Define a data atual como valor padrão no campo de data ao carregar a página.
   */
  function definirDataPadrao() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    campoData.value = `${ano}-${mes}-${dia}`;
  }

  definirDataPadrao();

  /**
   * Exibe uma mensagem de erro em vermelho abaixo de um campo específico
   * e adiciona a classe visual de campo inválido.
   * 
   * @param {HTMLElement} elementoCampo - O elemento do campo ou grupo
   * @param {HTMLElement} elementoErro - O elemento span onde a mensagem será inserida
   * @param {string} mensagem - O texto descritivo do erro
   */
  function exibirErro(elementoCampo, elementoErro, mensagem) {
    if (elementoCampo) {
      elementoCampo.classList.add("invalido");
    }
    if (elementoErro) {
      elementoErro.textContent = mensagem;
      elementoErro.classList.add("visivel");
    }
  }

  /**
   * Remove a mensagem de erro e a indicação visual de erro de um campo.
   * 
   * @param {HTMLElement} elementoCampo - O elemento do campo ou grupo
   * @param {HTMLElement} elementoErro - O elemento span de erro
   */
  function limparErro(elementoCampo, elementoErro) {
    if (elementoCampo) {
      elementoCampo.classList.remove("invalido");
    }
    if (elementoErro) {
      elementoErro.textContent = "";
      elementoErro.classList.remove("visivel");
    }
  }

  /**
   * Limpa todas as mensagens e bordas de erro de todos os campos.
   */
  function limparTodosErros() {
    limparErro(grupoTipo, erroTipo);
    limparErro(campoDescricao, erroDescricao);
    limparErro(campoValor, erroValor);
    limparErro(campoData, erroData);
    limparErro(campoCategoria, erroCategoria);
    limparErro(campoStatus, erroStatus);
  }

  /**
   * Oculta o alerta de sucesso da tela.
   */
  function ocultarAlertaSucesso() {
    if (alertaSucesso) {
      alertaSucesso.hidden = true;
    }
  }

  /**
   * Exibe o alerta de sucesso com os detalhes do lançamento cadastrado.
   * 
   * @param {Object} lancamento - O objeto com os dados validados
   */
  function exibirAlertaSucesso(lancamento) {
    if (!alertaSucesso) return;

    // Formata o valor para a exibição no padrão brasileiro de moeda
    const valorFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(lancamento.valor);

    // Formata a data de AAAA-MM-DD para DD/MM/AAAA
    const partesData = lancamento.data.split("-");
    const dataFormatada = partesData.length === 3
      ? `${partesData[2]}/${partesData[1]}/${partesData[0]}`
      : lancamento.data;

    const tipoNome = lancamento.tipo === "receita" ? "Receita" : "Despesa";

    alertDetalhes.textContent = `${tipoNome} de ${valorFormatado} ("${lancamento.descricao}") registrada para ${dataFormatada} [${lancamento.categoria} - ${lancamento.status.toUpperCase()}].`;
    alertaSucesso.hidden = false;

    // Rola suavemente a tela até o topo para facilitar a visualização do alerta
    alertaSucesso.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /**
   * Realiza a validação completa de todas as regras de negócio do formulário.
   * 
   * @returns {boolean} Retorna true se todos os campos forem válidos, caso contrário false
   */
  function validarFormulario() {
    let formularioValido = true;
    let primeiroCampoInvalido = null;

    // Limpa erros anteriores antes de validar novamente
    limparTodosErros();

    // 1. Validação do Tipo (deve ser 'receita' ou 'despesa')
    const tipoSelecionado = document.querySelector('input[name="tipo"]:checked');
    if (!tipoSelecionado) {
      exibirErro(grupoTipo, erroTipo, "Selecione o tipo de lançamento (Receita ou Despesa).");
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = radiosTipo[0];
    }

    // 2. Validação da Descrição (obrigatória, não vazia)
    const descricaoValor = campoDescricao.value.trim();
    if (descricaoValor === "") {
      exibirErro(campoDescricao, erroDescricao, "A descrição do lançamento é obrigatória.");
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = campoDescricao;
    } else if (descricaoValor.length < 3) {
      exibirErro(campoDescricao, erroDescricao, "A descrição deve ter pelo menos 3 caracteres.");
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = campoDescricao;
    }

    // 3. Validação do Valor (obrigatório, numérico e maior que zero)
    const valorDigitado = campoValor.value.trim();
    const valorNumerico = parseFloat(valorDigitado);

    if (valorDigitado === "" || isNaN(valorNumerico)) {
      exibirErro(campoValor, erroValor, "Informe um valor numérico válido.");
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = campoValor;
    } else if (valorNumerico <= 0) {
      exibirErro(campoValor, erroValor, "O valor do lançamento deve ser maior que zero (R$ 0,00).");
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = campoValor;
    }

    // 4. Validação da Data (obrigatória e preenchida)
    const dataValor = campoData.value.trim();
    if (dataValor === "") {
      exibirErro(campoData, erroData, "A data do lançamento é obrigatória.");
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = campoData;
    }

    // 5. Validação da Categoria (obrigatória e selecionada)
    const categoriasPermitidas = ["Vendas", "Aluguel", "Salários", "Impostos", "Outros"];
    const categoriaValor = campoCategoria.value.trim();

    if (categoriaValor === "" || !categoriasPermitidas.includes(categoriaValor)) {
      exibirErro(campoCategoria, erroCategoria, "Selecione uma categoria válida para o lançamento.");
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = campoCategoria;
    }

    // 6. Validação do Status (obrigatório: 'pendente' ou 'pago')
    const statusPermitidos = ["pendente", "pago"];
    const statusValor = campoStatus.value.trim();

    if (statusValor === "" || !statusPermitidos.includes(statusValor)) {
      exibirErro(campoStatus, erroStatus, "Selecione um status válido (Pendente ou Pago).");
      formularioValido = false;
      if (!primeiroCampoInvalido) primeiroCampoInvalido = campoStatus;
    }

    // Caso haja erro, foca o primeiro campo inválido para melhorar a usabilidade
    if (!formularioValido && primeiroCampoInvalido) {
      primeiroCampoInvalido.focus();
    }

    return formularioValido;
  }

  /**
   * Limpeza de erros em tempo real conforme o usuário interage com os campos.
   */
  radiosTipo.forEach((radio) => {
    radio.addEventListener("change", () => limparErro(grupoTipo, erroTipo));
  });

  campoDescricao.addEventListener("input", () => {
    if (campoDescricao.value.trim() !== "") {
      limparErro(campoDescricao, erroDescricao);
    }
  });

  campoValor.addEventListener("input", () => {
    const num = parseFloat(campoValor.value);
    if (!isNaN(num) && num > 0) {
      limparErro(campoValor, erroValor);
    }
  });

  campoData.addEventListener("input", () => {
    if (campoData.value.trim() !== "") {
      limparErro(campoData, erroData);
    }
  });

  campoCategoria.addEventListener("change", () => {
    if (campoCategoria.value.trim() !== "") {
      limparErro(campoCategoria, erroCategoria);
    }
  });

  campoStatus.addEventListener("change", () => {
    if (campoStatus.value.trim() !== "") {
      limparErro(campoStatus, erroStatus);
    }
  });

  /**
   * Manipulador do evento de envio (submit) do formulário.
   */
  formulario.addEventListener("submit", (evento) => {
    // Impede o recarregamento padrão da página
    evento.preventDefault();

    // Valida todos os campos de acordo com as regras de negócio
    if (!validarFormulario()) {
      ocultarAlertaSucesso();
      return;
    }

    // Monta o objeto com os dados validados do novo lançamento
    const novoLancamento = {
      tipo: document.querySelector('input[name="tipo"]:checked').value,
      descricao: campoDescricao.value.trim(),
      valor: parseFloat(parseFloat(campoValor.value).toFixed(2)),
      data: campoData.value,
      categoria: campoCategoria.value,
      status: campoStatus.value
    };

    // Exibe o objeto criado no console do desenvolvedor
    console.log("==========================================");
    console.log("Novo lançamento cadastrado com sucesso:");
    console.log(novoLancamento);
    console.log("==========================================");

    // Exibe a mensagem de sucesso na interface do usuário
    exibirAlertaSucesso(novoLancamento);

    // Limpa o formulário após o cadastro bem-sucedido
    formulario.reset();
    limparTodosErros();

    // Redefine a data atual como padrão para o próximo cadastro
    definirDataPadrao();
  });

  /**
   * Ação do botão "Limpar": redefine os campos, limpa erros e oculta alertas.
   */
  if (botaoLimpar) {
    botaoLimpar.addEventListener("click", () => {
      formulario.reset();
      limparTodosErros();
      ocultarAlertaSucesso();
      definirDataPadrao();
      campoDescricao.focus();
    });
  }

  /**
   * Ação do botão de fechar a mensagem de sucesso.
   */
  if (btnFecharSucesso) {
    btnFecharSucesso.addEventListener("click", ocultarAlertaSucesso);
  }
});
