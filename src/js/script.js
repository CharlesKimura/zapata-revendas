let currentIndex = 0;
let imageElements = [];
let veiculosFiltrados = [];
let paginaAtual = 1;
const itensPorPagina = 30;


const SUPABASE_URL = 'https://wbixlgxynxdmcajyucfp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaXhsZ3h5bnhkbWNhanl1Y2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDMyNjEsImV4cCI6MjA2MjU3OTI2MX0.SSF1hX6vAmHndsLp1D4A3P3miV4AaFw9dL7cg2COeK4'; // Troque pela sua

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function formatarPreco(valor) {
  const n = Number(valor);
  return isNaN(n) ? 'R$ --' : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarKm(valor) {
  const n = Number(valor);
  return isNaN(n) ? '-- km' : `${n.toLocaleString('pt-BR')} km`;
}

function gerarPublicUrl(path) {
  return client.storage.from('imagens').getPublicUrl(path).data.publicUrl;
}

function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function capitalizeWords(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function abrirModalDetalhes(veiculo, fotoUrl) {
  console.log('✅ Função abrirModalDetalhes chamada');
  const modal = document.getElementById('modalDetalhes');
  if (!modal) return;

  const titulo = `${capitalize(veiculo.marca)} ${capitalize(veiculo.modelo)}`;
  document.getElementById('modalTitulo').textContent = titulo;

  document.getElementById('modalPreco').textContent = formatarPreco(veiculo.preco);

  document.getElementById('modalAnoKm').textContent = `${veiculo.ano || '--'} | ${formatarKm(veiculo.km)}`;
  document.getElementById('modalLocal').textContent = `${capitalizeWords(veiculo.cidade)} / ${veiculo.uf?.toUpperCase() || '--'}`;

  const atributos = {
    modalCambio: veiculo.cambio ?? '--',
    modalMotor: veiculo.motor ?? '--',
    modalCombustivel: veiculo.combustivel ?? '--',
    modalDocumento: veiculo.documento ?? '--',
  };

  for (const [id, valor] of Object.entries(atributos)) {
    const el = document.getElementById(id);
    if (el) el.textContent = typeof valor === 'string' ? capitalize(valor) : valor;
  }

  const opcionais = {
    modalFarolMilha: veiculo.farol_milha,
    modalRetrovisorEletrico: veiculo.retrovisor_eletrico,
    modalCameraRe: veiculo.camera_re,
    modalSensorRe: veiculo.sensor_re,
    modalDirecao: veiculo.direcao,
    modalMultimidia: veiculo.multimidia,
    modalVolanteMultimidia: veiculo.volante_multimidia,
    modalArCondicionado: veiculo.ar_condicionado,
    modalRodaLigaLeve: veiculo.roda_liga_leve,
    modalAro: veiculo.aro,
    modalManual: veiculo.manual,
    modalChaveReserva: veiculo.chave_reserva,
  };

  for (const [id, valor] of Object.entries(opcionais)) {
    const el = document.getElementById(id);
    if (!el) continue;

    if (typeof valor === 'boolean') {
      el.textContent = valor ? 'Sim' : 'Não';
    } else if (valor === null || valor === undefined || valor === '') {
      el.textContent = '--';
    } else {
      el.textContent = capitalize(valor.toString());
    }
  }

  document.getElementById('modalDescricao').textContent = veiculo.descricao || 'Sem descrição.';

  const imagensContainer = document.querySelector('.carrossel-imagens');
  const indicadoresContainer = document.getElementById('carrosselIndicadores');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');

  if (!imagensContainer || !indicadoresContainer) {
    console.warn('❌ Elementos do carrossel não encontrados.');
    return;
  }

  imagensContainer.innerHTML = '';
  indicadoresContainer.innerHTML = '';

  const imagens = veiculo.imageUrl || [];
  let currentIndex = 0;
  let imageElements = [];

  function atualizarCarrossel(index) {
    imageElements.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });

    const indicadores = indicadoresContainer.querySelectorAll('button');
    indicadores.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  if (Array.isArray(imagens) && imagens.length > 0) {
    imagens.forEach((imgPath, i) => {
      const img = document.createElement('img');
      img.src = gerarPublicUrl(imgPath);
      img.alt = titulo;
      img.classList.add('carrossel-img');
      if (i === 0) img.classList.add('active');

      img.onload = () => {
        img.classList.add('fade-in');
        img.style.maxHeight = '700px';
        img.style.width = '100%';
      };

      imagensContainer.appendChild(img);
      imageElements.push(img);

      const indicador = document.createElement('button');
      if (i === 0) indicador.classList.add('active');
      indicador.addEventListener('click', () => {
        currentIndex = i;
        atualizarCarrossel(currentIndex);
      });
      indicadoresContainer.appendChild(indicador);
    });
  } else {
    const placeholder = document.createElement('img');
    placeholder.src = fotoUrl;
    placeholder.alt = 'Imagem do veículo';
    placeholder.classList.add('carrossel-img', 'active');
    placeholder.onload = () => {
      placeholder.classList.add('fade-in');
    };
    imagensContainer.appendChild(placeholder);
    imageElements.push(placeholder);
  }

  if (btnPrev && btnNext) {
    btnPrev.onclick = () => {
      currentIndex = (currentIndex - 1 + imageElements.length) % imageElements.length;
      atualizarCarrossel(currentIndex);
    };
    btnNext.onclick = () => {
      currentIndex = (currentIndex + 1) % imageElements.length;
      atualizarCarrossel(currentIndex);
    };
  }

  const telefoneVendedor = '5511956105614';

  const mensagem = `Olá, tenho interesse no ${titulo} do ano ${veiculo.ano} anunciado por ${formatarPreco(veiculo.preco)}.`;

  const linkWhatsApp = `https://wa.me/${telefoneVendedor}?text=${encodeURIComponent(mensagem)}`;

  const btnWhatsapp = document.getElementById('btnWhatsapp');
  btnWhatsapp.onclick = () => {
    window.open(linkWhatsApp, '_blank');
  };

  modal.classList.remove('hidden');
}

function renderizarCard(veiculo, fotoUrl) {
  console.log('🔁 Renderizando card:', veiculo.modelo);

  const container = document.getElementById('cards-container');
  const card = document.createElement('div');
  card.className = 'card';

  const preco = formatarPreco(veiculo.preco);
  const precoAntigo = veiculo.preco_antigo ? formatarPreco(veiculo.preco_antigo) : '';
  const km = formatarKm(veiculo.km);

  card.innerHTML = `
  <div class="card-image">
    <img src="${fotoUrl}" alt="${veiculo.marca} ${veiculo.modelo}">
  </div>
  <div class="card-content">
    <h3>${capitalize(veiculo.marca)}</h3>
      <p class="modelo">${capitalize(veiculo.modelo)}</p>
      <p class="detalhes">${km} | ${veiculo.ano || 'Ano'} | ${capitalize(veiculo.cambio)}</p>
      <p class="localizacao">📍 ${capitalizeWords(veiculo.cidade)}/${veiculo.uf?.toUpperCase()}</p>
  </div>
  `;

  card.addEventListener('click', () => {
    console.log('✅ Card clicado');
    abrirModalDetalhes(veiculo, fotoUrl);
  });
  const telefoneVendedor = '5511956105614';

  const mensagem = `Olá, tenho interesse no ${veiculo.marca} ${veiculo.modelo} do ano ${veiculo.ano} anunciado por ${veiculo.preco}.`;

  const linkWhatsApp = `https://wa.me/${telefoneVendedor}?text=${encodeURIComponent(mensagem)}`;

  const btnWhatsapp = document.getElementById('btnWhatsapp');
  btnWhatsapp.onclick = () => {
    window.open(linkWhatsApp, '_blank');
  };

  container.appendChild(card);
}

function renderizarPagina() {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  if (!Array.isArray(veiculosFiltrados) || veiculosFiltrados.length === 0) {
    container.innerHTML = '<p>Nenhum veículo encontrado.</p>';
    return;
  }

  const totalPaginas = Math.ceil(veiculosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const paginaVeiculos = veiculosFiltrados.slice(inicio, fim);

  for (const veiculo of paginaVeiculos) {
    let fotoUrl = 'https://placehold.co/600x400';
    const imagem = veiculo.imageUrl?.[0];

    if (imagem) {
      const path = imagem.replace(/^\/+/, '').replace(/\.(jpg|png|jpeg)?$/, '');
      const tentativa = gerarPublicUrl(`${path}.jpg`);
      fotoUrl = tentativa;
    }

    renderizarCard(veiculo, fotoUrl);
  }

  const spanPagina = document.getElementById('paginaAtual');
  if (spanPagina) spanPagina.textContent = paginaAtual;

  const btnAnterior = document.getElementById('paginaAnterior');
  const btnProxima = document.getElementById('proximaPagina');

  if (btnAnterior && btnProxima) {
    btnAnterior.disabled = paginaAtual === 1;
    btnProxima.disabled = paginaAtual >= totalPaginas;
  }
}

const btnAnterior = document.getElementById('paginaAnterior');
if (btnAnterior) {
  btnAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      renderizarPagina();
    }
  });
}

function renderizarPaginacao() {
  const totalPaginas = Math.ceil(veiculosFiltrados.length / itensPorPagina);
  const paginaAtualEl = document.getElementById('paginaAtual');
  const btnAnterior = document.getElementById('paginaAnterior');
  const btnProxima = document.getElementById('proximaPagina');

  paginaAtualEl.textContent = paginaAtual;
  btnAnterior.disabled = paginaAtual <= 1;
  btnProxima.disabled = paginaAtual >= totalPaginas;

  console.log(`📑 Página ${paginaAtual} de ${totalPaginas}`);
}

const btnProxima = document.getElementById('proximaPagina');
if (btnProxima) {
  btnProxima.addEventListener('click', () => {
    const totalPaginas = Math.ceil(veiculosFiltrados.length / itensPorPagina);
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      renderizarPagina();
    }
  });
}

async function carregarVeiculos(filtroTipo = 'todos') {
  const container = document.getElementById('cards-container');
  container.innerHTML = '<p>Carregando veículos...</p>';

  let veiculos = [];

  try {
    const resposta = await client.from('veiculos').select('*');
    veiculos = resposta.data;

    if (!veiculos || veiculos.length === 0) {
      container.innerHTML = '<p>Nenhum veículo encontrado.</p>';
      return;
    }

    if (resposta.error) {
      console.warn('⚠️ Supabase retornou um aviso:', resposta.error.message);
    }

  } catch (err) {
    console.error('❌ Erro ao buscar veículos:', err);
    container.innerHTML = '<p>Erro inesperado ao carregar veículos.</p>';
    return;
  }

  veiculosFiltrados = filtroTipo === 'todos'
    ? veiculos
    : veiculos.filter(v => v.tipo?.toLowerCase() === filtroTipo);

  if (veiculosFiltrados.length === 0) {
    container.innerHTML = '<p>Nenhum veículo encontrado para este filtro.</p>';
    return;
  }

  paginaAtual = 1;
  renderizarPagina();
}

const filtroTipoSelect = document.getElementById('filtroTipo');
if (filtroTipoSelect) {
  filtroTipoSelect.addEventListener('change', (e) => {
    const tipoSelecionado = e.target.value;
    document.getElementById('inputCodigo').value = '';
    carregarVeiculos(tipoSelecionado);
  });
}

function renderizarPagina() {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const paginaVeiculos = veiculosFiltrados.slice(inicio, fim);

  if (paginaVeiculos.length === 0) {
    container.innerHTML = '<p>Nenhum veículo encontrado.</p>';
    return;
  }

  paginaVeiculos.forEach(async veiculo => {
    let fotoUrl = 'https://placehold.co/300x200';
    const imagem = veiculo.imageUrl?.[0];

    if (imagem) {
      const path = imagem.replace(/^\/+/, '').replace(/\.(jpg|png|jpeg)?$/, '');
      const tentativa = gerarPublicUrl(`${path}.jpg`);
      try {
        const response = await fetch(tentativa, { method: 'HEAD' });
        if (response.ok) fotoUrl = tentativa;
      } catch (err) {
        console.warn('Erro ao verificar imagem:', err.message);
      }
    }

    renderizarCard(veiculo, fotoUrl);
  });

  renderizarPaginacao();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM carregado');
  const form = document.getElementById("whatsappForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const campos = [
        { id: "nome", label: "Nome" },
        { id: "telefone", label: "Telefone" },
        { id: "tipo", label: "Tipo" },
        { id: "marca", label: "Marca" },
        { id: "modelo", label: "Modelo" },
        { id: "ano", label: "Ano" },
        { id: "km", label: "Km" },
        { id: "preco", label: "Preço" },
        { id: "descricao", label: "Descrição" },
        { id: "documentacao", label: "Documentação" }
      ];

      const dados = {};
      let camposInvalidos = [];

      campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (!input || !input.value.trim()) {
          camposInvalidos.push(campo.label);
        } else {
          dados[campo.id] = input.value.trim();
        }
      });

      if (camposInvalidos.length > 0) {
        alert(`Por favor, preencha os seguintes campos obrigatórios:\n- ${camposInvalidos.join("\n- ")}`);
        return;
      }

      const texto = `Olá, meu nome é ${dados.nome}.
Telefone: ${dados.telefone}
Veículo: ${dados.tipo}
Marca: ${dados.marca}
Modelo: ${dados.modelo}
Ano: ${dados.ano}
Km: ${dados.km}
Preço: R$ ${Number(dados.preco).toLocaleString("pt-BR")}
Descrição: ${dados.descricao}
Documentação completa? ${dados.documentacao}`;

      const numeroWhatsApp = "5511956105614";
      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
      console.log("📦 URL gerada:", url);
      window.open(url, "_blank");
    });
  }

  const btnFecharModal = document.getElementById('btnFecharModal');
  if (btnFecharModal) {
    btnFecharModal.addEventListener('click', () => {
      document.getElementById('modalDetalhes')?.classList.add('hidden');
    });
  }

  carregarVeiculos();
});

document.getElementById('btnBuscarCodigo').addEventListener('click', async () => {
  const codigo = document.getElementById('inputCodigo').value.trim();

  if (codigo === '') {
    carregarVeiculos();
    return;
  }

  const container = document.getElementById('cards-container');
  container.innerHTML = '<p>Buscando veículo...</p>';

  const { data: veiculos, error } = await client
    .from('veiculos')
    .select('*')
    .eq('codigoVeiculo', codigo);

  if (error || !veiculos || veiculos.length === 0) {
    container.innerHTML = `<p>Nenhum veículo encontrado com o código <strong>${codigo}</strong>.</p>`;
    veiculosFiltrados = [];
    renderizarPaginacao();
    return;
  }

  veiculosFiltrados = veiculos;
  paginaAtual = 1;
  renderizarPagina();
});

document.getElementById('inputCodigo').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('btnBuscarCodigo').click();
  }
});