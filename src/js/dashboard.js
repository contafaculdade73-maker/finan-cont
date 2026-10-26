// Lista de lançamentos financeiros consistente com o sistema FinanCont.
const lancamentos = [
  { descricao: "Venda de produtos", categoria: "Vendas", data: "2026-10-22", valor: 2450.00, tipo: "receita", status: "pago" },
  { descricao: "Pagamento de aluguel", categoria: "Moradia", data: "2026-10-05", valor: 1800.00, tipo: "despesa", status: "pendente" },
  { descricao: "Serviço de consultoria", categoria: "Serviços", data: "2026-10-20", valor: 1200.00, tipo: "receita", status: "pendente" },
  { descricao: "Conta de energia", categoria: "Utilidades", data: "2026-10-10", valor: 386.42, tipo: "despesa", status: "pendente" },
  { descricao: "Internet empresarial", categoria: "Utilidades", data: "2026-10-18", valor: 129.90, tipo: "despesa", status: "pago" },
  { descricao: "Recebimento de cliente", categoria: "Clientes", data: "2026-10-21", valor: 3200.00, tipo: "receita", status: "pago" },
  { descricao: "Compra de materiais", categoria: "Suprimentos", data: "2026-10-12", valor: 547.80, tipo: "despesa", status: "pendente" },
  { descricao: "Mensalidade de software", categoria: "Tecnologia", data: "2026-10-23", valor: 89.90, tipo: "despesa", status: "pago" },
  { descricao: "Projeto de design", categoria: "Serviços", data: "2026-10-25", valor: 950.00, tipo: "receita", status: "pendente" },
  { descricao: "Manutenção de equipamentos", categoria: "Manutenção", data: "2026-10-08", valor: 420.00, tipo: "despesa", status: "pendente" },
  { descricao: "Rendimento de aplicação", categoria: "Investimentos", data: "2026-10-15", valor: 76.35, tipo: "receita", status: "pago" },
  { descricao: "Transporte e entregas", categoria: "Logística", data: "2026-10-24", valor: 215.60, tipo: "despesa", status: "pendente" },
  { descricao: "Venda pela internet", categoria: "Vendas", data: "2026-10-19", valor: 785.50, tipo: "receita", status: "pago" },
  { descricao: "Compra de material de escritório", categoria: "Escritório", data: "2026-10-14", valor: 164.75, tipo: "despesa", status: "pago" },
  { descricao: "Treinamento da equipe", categoria: "Treinamento", data: "2026-10-02", valor: 600.00, tipo: "despesa", status: "pendente" }
];

// Formatação brasileira de moeda (RNF04).
const formatarMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

// Formatação de data AAAA-MM-DD para DD/MM/AAAA (RNF04).
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Data atual no formato ISO AAAA-MM-DD.
function obterHojeISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// Determina status da despesa/receita considerando atrasos (RN02).
function obterStatus(lancamento) {
  const hoje = obterHojeISO();
  if (lancamento.tipo === "despesa" && lancamento.status === "pendente") {
    if (lancamento.data < hoje) {
      return { texto: "Atrasado", classe: "atrasado" };
    }
    if (lancamento.data === hoje) {
      return { texto: "Vence hoje", classe: "hoje" };
    }
    return { texto: "A vencer", classe: "pendente" };
  }
  return {
    texto: lancamento.status === "pago" ? "Pago" : "Pendente",
    classe: lancamento.status
  };
}

// Atualiza os indicadores principais do Dashboard (RF07 e RN03).
function atualizarIndicadores() {
  // RN03: Saldo = soma das receitas pagas - soma das despesas pagas.
  const receitasPagas = lancamentos
    .filter((item) => item.tipo === "receita" && item.status === "pago")
    .reduce((soma, item) => soma + item.valor, 0);

  const despesasPagas = lancamentos
    .filter((item) => item.tipo === "despesa" && item.status === "pago")
    .reduce((soma, item) => soma + item.valor, 0);

  const saldoAtual = receitasPagas - despesasPagas;

  // Receitas pendentes (a receber)
  const receitasPendentes = lancamentos
    .filter((item) => item.tipo === "receita" && item.status === "pendente")
    .reduce((soma, item) => soma + item.valor, 0);

  // Despesas pendentes (a pagar)
  const despesasPendentes = lancamentos
    .filter((item) => item.tipo === "despesa" && item.status === "pendente");

  const totalDespesasPendentes = despesasPendentes.reduce((soma, item) => soma + item.valor, 0);

  // Preenche elementos no DOM
  const elementoSaldo = document.querySelector("#kpi-saldo");
  elementoSaldo.textContent = formatarMoeda.format(saldoAtual);

  document.querySelector("#kpi-receitas").textContent = formatarMoeda.format(receitasPagas);
  document.querySelector("#kpi-receitas-pendentes").textContent = `A receber: ${formatarMoeda.format(receitasPendentes)}`;

  document.querySelector("#kpi-despesas").textContent = formatarMoeda.format(despesasPagas);
  document.querySelector("#kpi-despesas-pendentes").textContent = `A pagar: ${formatarMoeda.format(totalDespesasPendentes)}`;

  document.querySelector("#kpi-contas-vencer").textContent = `${despesasPendentes.length} pendentes`;
  document.querySelector("#kpi-total-vencer").textContent = `Total: ${formatarMoeda.format(totalDespesasPendentes)}`;

  // Atualiza barra de balanço financeiro
  const totalGeral = receitasPagas + despesasPagas;
  const pctReceitas = totalGeral > 0 ? (receitasPagas / totalGeral) * 100 : 50;
  const pctDespesas = totalGeral > 0 ? (despesasPagas / totalGeral) * 100 : 50;

  document.querySelector("#bar-receitas").style.width = `${pctReceitas}%`;
  document.querySelector("#bar-despesas").style.width = `${pctDespesas}%`;
  document.querySelector("#legend-receitas-total").textContent = formatarMoeda.format(receitasPagas);
  document.querySelector("#legend-despesas-total").textContent = formatarMoeda.format(despesasPagas);

  const taxaPoupanca = totalGeral > 0 ? ((saldoAtual / receitasPagas) * 100).toFixed(1) : 0;
  document.querySelector("#taxa-poupanca").textContent = `Margem líquida: ${taxaPoupanca}%`;
}

// Renderiza tabela com contas a vencer e atrasadas.
function renderizarContasVencer() {
  const tabela = document.querySelector("#tabela-contas-vencer");
  tabela.replaceChildren();

  const contasVencer = lancamentos
    .filter((item) => item.tipo === "despesa" && item.status === "pendente")
    .sort((a, b) => a.data.localeCompare(b.data));

  contasVencer.forEach((item) => {
    const tr = document.createElement("tr");
    const status = obterStatus(item);

    const tdDesc = document.createElement("td");
    tdDesc.textContent = item.descricao;

    const tdData = document.createElement("td");
    tdData.textContent = formatarData(item.data);

    const tdValor = document.createElement("td");
    tdValor.className = "numeric text-expense";
    tdValor.textContent = formatarMoeda.format(item.valor);

    const tdStatus = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `status-badge ${status.classe}`;
    badge.textContent = status.texto;
    tdStatus.appendChild(badge);

    tr.append(tdDesc, tdData, tdValor, tdStatus);
    tabela.appendChild(tr);
  });
}

// Renderiza as movimentações mais recentes.
function renderizarUltimosLancamentos() {
  const tabela = document.querySelector("#tabela-ultimos-lancamentos");
  tabela.replaceChildren();

  const ultimos = [...lancamentos]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 6);

  ultimos.forEach((item) => {
    const tr = document.createElement("tr");

    const tdDesc = document.createElement("td");
    tdDesc.textContent = item.descricao;

    const tdCat = document.createElement("td");
    tdCat.textContent = item.categoria;

    const tdData = document.createElement("td");
    tdData.textContent = formatarData(item.data);

    const tdValor = document.createElement("td");
    tdValor.className = `numeric ${item.tipo === "receita" ? "text-income" : "text-expense"}`;
    tdValor.textContent = `${item.tipo === "receita" ? "+" : "-"} ${formatarMoeda.format(item.valor)}`;

    tr.append(tdDesc, tdCat, tdData, tdValor);
    tabela.appendChild(tr);
  });
}

// Inicialização da tela.
document.addEventListener("DOMContentLoaded", () => {
  atualizarIndicadores();
  renderizarContasVencer();
  renderizarUltimosLancamentos();
});
