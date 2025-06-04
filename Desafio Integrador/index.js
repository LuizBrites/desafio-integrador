const form = document.getElementById("produtoForm");
const tabela = document.getElementById("tabelaProdutos");
const totalEl = document.getElementById("valorTotal");
const submitBtn = document.getElementById("submitBtn");

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let editandoId = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const preco = parseFloat(document.getElementById("preco").value);

  if (!nome || quantidade < 0 || preco < 0) return;

  if (editandoId) {
    produtos = produtos.map(p => p.id === editandoId ? { id: editandoId, nome, quantidade, preco } : p);
    submitBtn.textContent = "Adicionar";
    editandoId = null;
  } else {
    produtos.push({ id: Date.now(), nome, quantidade, preco });
  }

  form.reset();
  salvarDados();
  renderProdutos();
});

function renderProdutos() {
  tabela.innerHTML = "";

  if (produtos.length === 0) {
    tabela.innerHTML = '<tr><td colspan="4">Nenhum produto cadastrado.</td></tr>';
    totalEl.textContent = "Valor total do estoque: R$ 0.00";
    return;
  }

  let total = 0;
  produtos.forEach(prod => {
    total += prod.quantidade * prod.preco;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.nome}</td>
      <td>${prod.quantidade}</td>
      <td>R$ ${prod.preco.toFixed(2)}</td>
      <td>
        <button style="background-color: #81c784;" onclick="editarProduto(${prod.id})">Editar</button>
        <button style="background-color: #e57373;" onclick="excluirProduto(${prod.id})">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });

  totalEl.textContent = `Valor total do estoque: R$ ${total.toFixed(2)}`;
}

function salvarDados() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

window.editarProduto = (id) => {
  const produto = produtos.find(p => p.id === id);
  document.getElementById("nome").value = produto.nome;
  document.getElementById("quantidade").value = produto.quantidade;
  document.getElementById("preco").value = produto.preco;
  submitBtn.textContent = "Atualizar";
  editandoId = id;
};

window.excluirProduto = (id) => {
  produtos = produtos.filter(p => p.id !== id);
  salvarDados();
  renderProdutos();
};

renderProdutos();
